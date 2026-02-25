import { z } from "zod";
export declare const addToCartSchema: z.ZodObject<{
    comboId: z.ZodString;
    quantity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateQtySchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=cart.validation.d.ts.map