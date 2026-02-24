import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateRequest =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            const parsed = schema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: parsed.error.flatten(),
                });
            }

            req.body = parsed.data;
            next();
        };