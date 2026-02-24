import { Response } from "express";

/**
 * API Response Structure
 */
interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

/**
 * Standardized API Response Sender
 */
const sendResponse = <T>(res: Response, payload: IResponse<T>): void => {
    const {
        statusCode,
        success,
        message = "Success",
        data,
        meta,
    } = payload;

    res.status(statusCode).json({
        success,
        message,
        ...(meta && { meta }),
        ...(data !== undefined && { data }),
    });
};

export default sendResponse;