import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ComboService } from "./combo.service";
import {
    createComboSchema,
    updateComboSchema,
    updatePriceSchema,
    updateStockSchema,
} from "./combo.validation";

export const ComboController = {
    // ✅ GET /combos
    listActive: catchAsync(async (req: Request, res: Response) => {
        const data = await ComboService.listActiveCombos();

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Active combos fetched",
            data,
        });
    }),

    // ✅ GET /combos/:slug
    getBySlug: catchAsync(async (req: Request, res: Response) => {
        const { slug } = req.params;

        const data = await ComboService.getComboBySlug(slug as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Combo fetched",
            data,
        });
    }),

    // ✅ POST /admin/combos
    create: catchAsync(async (req: Request, res: Response) => {
        const payload = createComboSchema.parse(req.body);

        const data = await ComboService.createCombo(payload as any);

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Combo created",
            data,
        });
    }),

    // ✅ PATCH /admin/combos/:id
    update: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = updateComboSchema.parse(req.body);

        const data = await ComboService.updateComboById(id as string, payload as any);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Combo updated",
            data,
        });
    }),

    // ✅ PATCH /admin/combos/:id/toggle
    toggle: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        const data = await ComboService.toggleComboActive(id as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: `Combo isActive toggled to ${data.isActive}`,
            data,
        });
    }),

    // ✅ PATCH /admin/combos/:id/stock
    updateStock: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { stock } = updateStockSchema.parse(req.body);

        const data = await ComboService.updateStock(id as string, stock);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Stock updated",
            data,
        });
    }),

    // ✅ PATCH /admin/combos/:id/price
    updatePrice: catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { price } = updatePriceSchema.parse(req.body);

        const data = await ComboService.updatePrice(id as string, price);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Price updated",
            data,
        });
    }),
};