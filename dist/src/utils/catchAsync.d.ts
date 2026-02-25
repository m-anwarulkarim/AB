import { RequestHandler } from "express";
/**
 * catchAsync
 * Async controller এর error automatically next() এ পাঠানোর wrapper
 */
declare const catchAsync: <T = unknown>(fn: RequestHandler) => RequestHandler;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map