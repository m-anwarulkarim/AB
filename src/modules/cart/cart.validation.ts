import { z } from "zod";

export const addToCartSchema = z.object({
    comboId: z.string().min(1, "comboId is required"),
    quantity: z.number().int().min(1, "quantity must be >= 1").optional(),
});

export const updateQtySchema = z.object({
    quantity: z.number().int().min(1, "quantity must be >= 1"),
});