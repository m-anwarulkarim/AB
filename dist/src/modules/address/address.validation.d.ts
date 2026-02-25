import { z } from "zod";
export declare const createAddressSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    fullName: z.ZodString;
    phone: z.ZodString;
    district: z.ZodOptional<z.ZodString>;
    upazila: z.ZodOptional<z.ZodString>;
    area: z.ZodOptional<z.ZodString>;
    addressLine: z.ZodString;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateAddressSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    district: z.ZodOptional<z.ZodString>;
    upazila: z.ZodOptional<z.ZodString>;
    area: z.ZodOptional<z.ZodString>;
    addressLine: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=address.validation.d.ts.map