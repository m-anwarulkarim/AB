import { z } from "zod";

export const createAddressSchema = z.object({
    label: z.string().max(50).optional(),
    fullName: z.string().min(2, "fullName is required"),
    phone: z.string().min(6, "phone is required"),
    district: z.string().max(100).optional(),
    upazila: z.string().max(100).optional(),
    area: z.string().max(150).optional(),
    addressLine: z.string().min(5, "addressLine is required"),
    isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
    label: z.string().max(50).optional(),
    fullName: z.string().min(2).optional(),
    phone: z.string().min(6).optional(),
    district: z.string().max(100).optional(),
    upazila: z.string().max(100).optional(),
    area: z.string().max(150).optional(),
    addressLine: z.string().min(5).optional(),
    isDefault: z.boolean().optional(), // allow but we will manage default via endpoint too
});