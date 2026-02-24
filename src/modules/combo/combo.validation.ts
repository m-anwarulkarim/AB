import { z } from "zod";

export const createComboSchema = z.object({
    title: z.string().min(2, "title is required"),
    slug: z.string().min(2, "slug is required"),
    description: z.string().optional(),
    price: z.number().int().min(0, "price must be >= 0"),
    stock: z.number().int().min(0, "stock must be >= 0").optional(),
    imageUrl: z.string().url("imageUrl must be a valid url").optional(),
    isActive: z.boolean().optional(),

    items: z
        .array(
            z.object({
                name: z.string().min(1, "item name is required"),
                quantity: z.string().min(1, "item quantity is required"),
                note: z.string().optional(),
            })
        )
        .optional(),
});

export const updateComboSchema = z.object({
    title: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().int().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),

    // items দিলে: replace strategy
    items: z
        .array(
            z.object({
                name: z.string().min(1),
                quantity: z.string().min(1),
                note: z.string().optional(),
            })
        )
        .optional(),
});

export const updateStockSchema = z.object({
    stock: z.number().int().min(0, "stock must be >= 0"),
});

export const updatePriceSchema = z.object({
    price: z.number().int().min(0, "price must be >= 0"),
});