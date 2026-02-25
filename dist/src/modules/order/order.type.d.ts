import { OrderStatus } from "../../../generated/prisma/enums.js";
export type CheckoutInput = {
    addressId?: string;
    note?: string;
};
export type UpdateOrderStatusInput = {
    status: OrderStatus;
};
//# sourceMappingURL=order.type.d.ts.map