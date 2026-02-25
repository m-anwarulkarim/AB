export const validateRequest = (schema) => (req, res, next) => {
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
//# sourceMappingURL=validateRequest.js.map