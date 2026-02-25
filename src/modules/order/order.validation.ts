import { z } from "zod";
import { OrderStatus } from "../../../generated/prisma/enums";

export const checkoutSchema = z.object({
    addressId: z.string().min(1).optional(),
    note: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});