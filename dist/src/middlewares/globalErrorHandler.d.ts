import { ErrorRequestHandler } from "express";
/**
 * globalErrorHandler: Express special middleware (৪টা প্যারামিটার)
 * catchAsync/throw থেকে আসা সব error এখানেই handle হবে।
 */
declare const globalErrorHandler: ErrorRequestHandler;
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.d.ts.map