import { OrderStatus } from "../../../generated/prisma/enums.js";

export type CheckoutInput = {
  addressId?: string; // optional (server default address fallback)
  note?: string; // optional
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};
