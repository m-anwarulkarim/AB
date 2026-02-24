import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "password must be at least 6 characters"),
});

export const signInSchema = z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(1, "password is required"),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, "refreshToken is required"),
});