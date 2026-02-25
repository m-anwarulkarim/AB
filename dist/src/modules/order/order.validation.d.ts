import { z } from "zod";
export declare const checkoutSchema: z.ZodObject<{
    addressId: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        readonly PENDING: "PENDING";
        readonly CONFIRMED: "CONFIRMED";
        readonly SHIPPED: "SHIPPED";
        readonly DELIVERED: "DELIVERED";
        readonly CANCELLED: "CANCELLED";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=order.validation.d.ts.map