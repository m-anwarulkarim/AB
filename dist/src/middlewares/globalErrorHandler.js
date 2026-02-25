import logger from "../config/log.js";
import { envVars } from "../config/env.js";
/**
 * globalErrorHandler: Express special middleware (৪টা প্যারামিটার)
 * catchAsync/throw থেকে আসা সব error এখানেই handle হবে।
 */
const globalErrorHandler = (err, req, res, next) => {
    const error = err;
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? "Internal Server Error";
    // ১) Stack trace থেকে origin line বের করা
    const stackLines = error.stack ? error.stack.split("\n") : [];
    const originLine = stackLines.length > 1 ? stackLines[1]?.trim() ?? "Unknown position" : "Unknown position";
    logger.error({
        message: error.message,
        code: error.code ?? "UNHANDLED_ERROR",
        statusCode,
        location: originLine,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: error.details ?? null,
        stack: error.stack,
    });
    return res.status(statusCode).json({
        success: false,
        message,
        // dev environment এ debug info
        ...(envVars.NODE_ENV === "development" && {
            errorSource: originLine,
            stack: error.stack,
            code: error.code,
            details: error.details,
        }),
    });
};
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map