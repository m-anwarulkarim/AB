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
declare const sendResponse: <T>(res: Response, payload: IResponse<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map