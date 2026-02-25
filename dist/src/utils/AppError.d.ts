export declare class AppError extends Error {
    readonly statusCode: number;
    readonly status: string;
    readonly isOperational: boolean;
    constructor(statusCode: number, message: string);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map