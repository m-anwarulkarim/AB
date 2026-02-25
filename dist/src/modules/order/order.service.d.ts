import { CheckoutInput, UpdateOrderStatusInput } from "./order.type.js";
import { OrderStatus } from "../../../generated/prisma/enums.js";
declare function getUserId(reqUser: Express.Request["user"]): string;
export declare const OrderService: {
    getUserId: typeof getUserId;
    checkout(userId: string, payload: CheckoutInput): Promise<any>;
    myOrders(userId: string): Promise<({
        items: {
            id: string;
            title: string;
            quantity: number;
            comboId: string;
            unitPrice: number;
            orderId: string;
            lineTotal: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        note: string | null;
        guestId: string | null;
        addressId: string | null;
        customerName: string;
        customerPhone: string;
        deliveryCharge: number;
        discount: number;
        orderNo: string;
        status: OrderStatus;
        paymentMethod: import("../../../generated/prisma/enums.js").PaymentMethod;
        shippingAddress: string;
        subtotal: number;
        total: number;
    })[]>;
    myOrderByNo(userId: string, orderNo: string): Promise<{
        items: {
            id: string;
            title: string;
            quantity: number;
            comboId: string;
            unitPrice: number;
            orderId: string;
            lineTotal: number;
        }[];
        address: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            guestId: string | null;
            label: string | null;
            fullName: string;
            district: string | null;
            upazila: string | null;
            area: string | null;
            addressLine: string;
            isDefault: boolean;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        note: string | null;
        guestId: string | null;
        addressId: string | null;
        customerName: string;
        customerPhone: string;
        deliveryCharge: number;
        discount: number;
        orderNo: string;
        status: OrderStatus;
        paymentMethod: import("../../../generated/prisma/enums.js").PaymentMethod;
        shippingAddress: string;
        subtotal: number;
        total: number;
    }>;
    adminListOrders(statusFilter?: OrderStatus): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
            emailVerified: boolean;
            image: string | null;
            phone: string | null;
            role: import("../../../generated/prisma/enums.js").UserRole;
            userStatus: import("../../../generated/prisma/enums.js").USER_STATUS;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            isDeleted: boolean;
        } | null;
        items: {
            id: string;
            title: string;
            quantity: number;
            comboId: string;
            unitPrice: number;
            orderId: string;
            lineTotal: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        note: string | null;
        guestId: string | null;
        addressId: string | null;
        customerName: string;
        customerPhone: string;
        deliveryCharge: number;
        discount: number;
        orderNo: string;
        status: OrderStatus;
        paymentMethod: import("../../../generated/prisma/enums.js").PaymentMethod;
        shippingAddress: string;
        subtotal: number;
        total: number;
    })[]>;
    adminUpdateStatus(orderId: string, payload: UpdateOrderStatusInput): Promise<{
        items: {
            id: string;
            title: string;
            quantity: number;
            comboId: string;
            unitPrice: number;
            orderId: string;
            lineTotal: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        note: string | null;
        guestId: string | null;
        addressId: string | null;
        customerName: string;
        customerPhone: string;
        deliveryCharge: number;
        discount: number;
        orderNo: string;
        status: OrderStatus;
        paymentMethod: import("../../../generated/prisma/enums.js").PaymentMethod;
        shippingAddress: string;
        subtotal: number;
        total: number;
    }>;
    previewCheckout(userId: string, payload: CheckoutInput): Promise<{
        subtotal: any;
        deliveryCharge: number;
        discount: number;
        total: number;
        rule: {
            totalQty: any;
            discountSteps: number;
        };
    }>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map