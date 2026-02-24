import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * catchAsync
 * Async controller এর error automatically next() এ পাঠানোর wrapper
 */
const catchAsync =
    <T = unknown>(fn: RequestHandler): RequestHandler =>
        (req: Request, res: Response, next: NextFunction): void => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

export default catchAsync;