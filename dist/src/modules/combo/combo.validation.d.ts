import { z } from "zod";
export declare const createComboSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    stock: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        quantity: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateComboSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        quantity: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateStockSchema: z.ZodObject<{
    stock: z.ZodNumber;
}, z.core.$strip>;
export declare const updatePriceSchema: z.ZodObject<{
    price: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=combo.validation.d.ts.map