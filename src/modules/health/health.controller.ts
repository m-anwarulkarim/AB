// src/modules/health/health.controller.ts

import { Request, Response } from "express";
import { healthService } from "./health.service";
import sendResponse from "../../utils/sendResponse";

export const healthController = (req: Request, res: Response) => {
    const result = healthService();

    return sendResponse(res, {
        statusCode: 200,
        success: result.success,
        message: result.message,
        data: {
            uptime: result.uptime,
            timestamp: result.timestamp,
        },
    })
};