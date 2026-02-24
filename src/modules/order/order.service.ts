import status from "http-status";
import AppError from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { CheckoutInput, UpdateOrderStatusInput } from "./order.type";
import { OrderStatus } from "../../../generated/prisma/enums";

function getUserId(reqUser: Express.Request["user"]): string {
    if (!reqUser?.id) throw new AppError(status.UNAUTHORIZED, "Unauthorized - Please login");
    return reqUser.id;
}

function generateOrderNo(): string {
    // Example: NT-20260224-735921 (simple unique-ish)
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `NT-${yyyy}${mm}${dd}-${rand}`;
}

export const OrderService = {
    getUserId,

    // ✅ POST /orders/checkout
    async checkout(userId: string, payload: CheckoutInput) {
        const deliveryCharge = payload.deliveryCharge ?? 0;

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

        // 2) Address snapshot (optional but best)
        let addressSnapshot: {
            addressId: string | null;
            customerName: string;
            customerPhone: string;
            shippingAddress: string;
        } | null = null;

        if (payload.addressId) {
            const addr = await prisma.address.findFirst({
                where: { id: payload.addressId, userId },
            });

            if (!addr) {
                throw new AppError(status.NOT_FOUND, "Address not found");
            }

            const fullAddress = [
                addr.addressLine,
                addr.area,
                addr.upazila,
                addr.district,
            ]
                .filter(Boolean)
                .join(", ");

            addressSnapshot = {
                addressId: addr.id,
                customerName: addr.fullName,
                customerPhone: addr.phone,
                shippingAddress: fullAddress || addr.addressLine,
            };
        } else {
            // যদি addressId না দেয়, তাহলে default address try (optional behavior)
            const defaultAddr = await prisma.address.findFirst({
                where: { userId, isDefault: true },
            });

            if (defaultAddr) {
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
            } else {
                // schema অনুযায়ী order এ customerName/customerPhone/shippingAddress required
                throw new AppError(status.BAD_REQUEST, "Address is required (no default address found)");
            }
        }

        // 3) Build totals + validate combos
        // Note: এখানে unitPrice হিসেবে cartItem.unitPrice (snapshot) ব্যবহার করছি
        // তুমি চাইলে combo.price (current) নিতে পারো।
        const lineItems = cart.items.map((ci) => {
            const combo = ci.combo;

            if (!combo || combo.isActive === false) {
                throw new AppError(status.BAD_REQUEST, "One or more combos are unavailable");
            }

            if (combo.stock < ci.quantity) {
                throw new AppError(
                    status.BAD_REQUEST,
                    `Not enough stock for "${combo.title}". Available: ${combo.stock}`
                );
            }

            const unitPrice = ci.unitPrice; // snapshot from cart
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
        const total = subtotal + deliveryCharge;

        // 4) Transaction: create order + items, decrement stock, clear cart
        const created = await prisma.$transaction(async (tx) => {
            // orderNo uniqueness retry (simple)
            let orderNo = generateOrderNo();
            for (let i = 0; i < 3; i++) {
                const exists = await tx.order.findUnique({ where: { orderNo }, select: { id: true } });
                if (!exists) break;
                orderNo = generateOrderNo();
            }

            // create order
            const order = await tx.order.create({
                data: {
                    orderNo,
                    userId,
                    addressId: addressSnapshot?.addressId ?? null,

                    status: OrderStatus.PENDING,

                    customerName: addressSnapshot!.customerName,
                    customerPhone: addressSnapshot!.customerPhone,
                    shippingAddress: addressSnapshot!.shippingAddress,

                    subtotal,
                    deliveryCharge,
                    total,

                    ...(payload.note ? { note: payload.note } : {}), // exactOptional safe
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

            // decrement stock for each combo
            for (const li of lineItems) {
                // extra safety: conditional update (race condition safe-ish)
                const updated = await tx.combo.update({
                    where: { id: li.comboId },
                    data: { stock: { decrement: li.quantity } },
                    select: { id: true },
                });

                if (!updated) {
                    throw new AppError(status.INTERNAL_SERVER_ERROR, "Stock update failed");
                }
            }

            // clear cart items
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return order;
        });

        return created;
    },

    // ✅ GET /orders (my orders)
    async myOrders(userId: string) {
        return prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    },

    // ✅ GET /orders/:orderNo (my order details)
    async myOrderByNo(userId: string, orderNo: string) {
        const order = await prisma.order.findFirst({
            where: { userId, orderNo },
            include: { items: true, address: true },
        });

        if (!order) throw new AppError(status.NOT_FOUND, "Order not found");
        return order;
    },

    // ✅ Admin: GET /admin/orders?status=PENDING
    async adminListOrders(statusFilter?: OrderStatus) {
        return prisma.order.findMany({
            where: statusFilter ? { status: statusFilter } : {},
            orderBy: { createdAt: "desc" },
            include: { items: true, user: true },
        });
    },

    // ✅ Admin: PATCH /admin/orders/:id/status
    async adminUpdateStatus(orderId: string, payload: UpdateOrderStatusInput) {
        const exists = await prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true },
        });

        if (!exists) throw new AppError(status.NOT_FOUND, "Order not found");

        return prisma.order.update({
            where: { id: orderId },
            data: { status: payload.status },
            include: { items: true },
        });
    },
};