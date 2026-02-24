import { OrderStatus } from "../../../generated/prisma/enums";


export type CheckoutInput = {
    addressId?: string;        // optional (but recommended)
    deliveryCharge?: number;   // optional (default 0)
    note?: string;             // optional
};

export type UpdateOrderStatusInput = {
    status: OrderStatus;
};