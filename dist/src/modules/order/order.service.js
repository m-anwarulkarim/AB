import status from "http-status";
import AppError from "../../utils/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { OrderStatus } from "../../../generated/prisma/enums.js";
function getUserId(reqUser) {
    if (!reqUser?.id)
        throw new AppError(status.UNAUTHORIZED, "Unauthorized - Please login");
    return reqUser.id;
}
function generateOrderNo() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `NT-${yyyy}${mm}${dd}-${rand}`;
}
/**
 * ✅ Cart-based rule
 * totalQty = cart.items total quantity (qty sum)
 */
function calcCartRule(totalQty) {
    let deliveryCharge = 0;
    let discount = 0;
    if (totalQty <= 0)
        return { deliveryCharge: 0, discount: 0 };
    // 1 item => 50 delivery
    if (totalQty === 1)
        deliveryCharge = 50;
    // 2+ => free delivery
    else
        deliveryCharge = 0;
    // 3+ => 15 discount per extra item from 3rd
    // 3 => 15, 4 => 30, 5 => 45 ...
    if (totalQty >= 3)
        discount = (totalQty - 2) * 15;
    return { deliveryCharge, discount };
}
export const OrderService = {
    getUserId,
    // ✅ POST /orders/checkout
    async checkout(userId, payload) {
        // 1) Load cart with items + combo
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { combo: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new AppError(status.BAD_REQUEST, "Cart is empty");
        }
        // ✅ total quantity from cart
        const totalQty = cart.items.reduce((sum, it) => sum + (it.quantity ?? 1), 0);
        const { deliveryCharge, discount: productDiscount } = calcCartRule(totalQty);
        // 2) Address snapshot
        let addressSnapshot = null;
        if (payload.addressId) {
            const addr = await prisma.address.findFirst({
                where: { id: payload.addressId, userId },
            });
            if (!addr)
                throw new AppError(status.NOT_FOUND, "Address not found");
            const fullAddress = [addr.addressLine, addr.area, addr.upazila, addr.district]
                .filter(Boolean)
                .join(", ");
            addressSnapshot = {
                addressId: addr.id,
                customerName: addr.fullName,
                customerPhone: addr.phone,
                shippingAddress: fullAddress || addr.addressLine,
            };
        }
        else {
            const defaultAddr = await prisma.address.findFirst({
                where: { userId, isDefault: true },
            });
            if (!defaultAddr) {
                throw new AppError(status.BAD_REQUEST, "Address is required (no default address found)");
            }
            const fullAddress = [
                defaultAddr.addressLine,
                defaultAddr.area,
                defaultAddr.upazila,
                defaultAddr.district,
            ]
                .filter(Boolean)
                .join(", ");
            addressSnapshot = {
                addressId: defaultAddr.id,
                customerName: defaultAddr.fullName,
                customerPhone: defaultAddr.phone,
                shippingAddress: fullAddress || defaultAddr.addressLine,
            };
        }
        // 3) Build line items + validate
        const lineItems = cart.items.map((ci) => {
            const combo = ci.combo;
            if (!combo || combo.isActive === false) {
                throw new AppError(status.BAD_REQUEST, "One or more combos are unavailable");
            }
            if (combo.stock < ci.quantity) {
                throw new AppError(status.BAD_REQUEST, `Not enough stock for "${combo.title}". Available: ${combo.stock}`);
            }
            const unitPrice = ci.unitPrice; // snapshot
            const lineTotal = unitPrice * ci.quantity;
            return {
                comboId: combo.id,
                title: combo.title,
                quantity: ci.quantity,
                unitPrice,
                lineTotal,
            };
        });
        const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
        // ✅ Apply delivery + discount
        const grossTotal = subtotal + deliveryCharge;
        const total = Math.max(0, grossTotal - productDiscount);
        // 4) Transaction: create order + items, decrement stock, clear cart
        const created = await prisma.$transaction(async (tx) => {
            let orderNo = generateOrderNo();
            for (let i = 0; i < 3; i++) {
                const exists = await tx.order.findUnique({ where: { orderNo }, select: { id: true } });
                if (!exists)
                    break;
                orderNo = generateOrderNo();
            }
            const order = await tx.order.create({
                data: {
                    orderNo,
                    userId,
                    addressId: addressSnapshot?.addressId ?? null,
                    status: OrderStatus.PENDING,
                    customerName: addressSnapshot.customerName,
                    customerPhone: addressSnapshot.customerPhone,
                    shippingAddress: addressSnapshot.shippingAddress,
                    subtotal,
                    deliveryCharge,
                    discount: productDiscount,
                    total,
                    ...(payload.note ? { note: payload.note } : {}),
                    items: {
                        create: lineItems.map((li) => ({
                            comboId: li.comboId,
                            title: li.title,
                            quantity: li.quantity,
                            unitPrice: li.unitPrice,
                            lineTotal: li.lineTotal,
                        })),
                    },
                },
                include: { items: true },
            });
            // ✅ Race-safe stock decrement
            for (const li of lineItems) {
                const updated = await tx.combo.updateMany({
                    where: {
                        id: li.comboId,
                        isActive: true,
                        stock: { gte: li.quantity },
                    },
                    data: { stock: { decrement: li.quantity } },
                });
                if (updated.count !== 1) {
                    throw new AppError(status.BAD_REQUEST, `Not enough stock for "${li.title}".`);
                }
            }
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            return order;
        });
        return created;
    },
    // ✅ GET /orders (my orders)
    async myOrders(userId) {
        return prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    },
    // ✅ GET /orders/:orderNo (my order details)
    async myOrderByNo(userId, orderNo) {
        const order = await prisma.order.findFirst({
            where: { userId, orderNo },
            include: { items: true, address: true },
        });
        if (!order)
            throw new AppError(status.NOT_FOUND, "Order not found");
        return order;
    },
    // ✅ Admin: GET /admin/orders?status=PENDING
    async adminListOrders(statusFilter) {
        return prisma.order.findMany({
            where: statusFilter ? { status: statusFilter } : {},
            orderBy: { createdAt: "desc" },
            include: { items: true, user: true },
        });
    },
    // ✅ Admin: PATCH /admin/orders/:id/status
    async adminUpdateStatus(orderId, payload) {
        const exists = await prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true },
        });
        if (!exists)
            throw new AppError(status.NOT_FOUND, "Order not found");
        return prisma.order.update({
            where: { id: orderId },
            data: { status: payload.status },
            include: { items: true },
        });
    },
    // ✅ POST /orders/preview (order create না করে শুধু হিসাব)
    async previewCheckout(userId, payload) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { combo: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new AppError(status.BAD_REQUEST, "Cart is empty");
        }
        // ✅ total quantity
        const totalQty = cart.items.reduce((sum, it) => sum + (it.quantity ?? 1), 0);
        const { deliveryCharge, discount } = calcCartRule(totalQty);
        // validate + subtotal
        const subtotal = cart.items.reduce((sum, ci) => {
            const combo = ci.combo;
            if (!combo || combo.isActive === false) {
                throw new AppError(status.BAD_REQUEST, "One or more combos are unavailable");
            }
            if (combo.stock < ci.quantity) {
                throw new AppError(status.BAD_REQUEST, `Not enough stock for "${combo.title}". Available: ${combo.stock}`);
            }
            const unitPrice = ci.unitPrice;
            return sum + unitPrice * ci.quantity;
        }, 0);
        const total = Math.max(0, subtotal + deliveryCharge - discount);
        return {
            subtotal,
            deliveryCharge,
            discount,
            total,
            rule: {
                totalQty, // ✅ UI-friendly
                discountSteps: totalQty >= 3 ? totalQty - 2 : 0,
            },
        };
    },
};
//# sourceMappingURL=order.service.js.map