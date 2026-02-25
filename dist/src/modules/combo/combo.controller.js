import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ComboService } from "./combo.service.js";
import { createComboSchema, updateComboSchema, updatePriceSchema, updateStockSchema, } from "./combo.validation.js";
export const ComboController = {
    // ✅ GET /combos
    listActive: catchAsync(async (req, res) => {
        const data = await ComboService.listActiveCombos();
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Active combos fetched",
            data,
        });
    }),
    // ✅ GET /combos/:slug
    getBySlug: catchAsync(async (req, res) => {
        const { slug } = req.params;
        const data = await ComboService.getComboBySlug(slug);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Combo fetched",
            data,
        });
    }),
    // ✅ POST /admin/combos
    create: catchAsync(async (req, res) => {
        const payload = createComboSchema.parse(req.body);
        const data = await ComboService.createCombo(payload);
        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Combo created",
            data,
        });
    }),
    // ✅ PATCH /admin/combos/:id
    update: catchAsync(async (req, res) => {
        const { id } = req.params;
        const payload = updateComboSchema.parse(req.body);
        const data = await ComboService.updateComboById(id, payload);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Combo updated",
            data,
        });
    }),
    // ✅ PATCH /admin/combos/:id/toggle
    toggle: catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await ComboService.toggleComboActive(id);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: `Combo isActive toggled to ${data.isActive}`,
            data,
        });
    }),
    // ✅ PATCH /admin/combos/:id/stock
    updateStock: catchAsync(async (req, res) => {
        const { id } = req.params;
        const { stock } = updateStockSchema.parse(req.body);
        const data = await ComboService.updateStock(id, stock);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Stock updated",
            data,
        });
    }),
    // ✅ PATCH /admin/combos/:id/price
    updatePrice: catchAsync(async (req, res) => {
        const { id } = req.params;
        const { price } = updatePriceSchema.parse(req.body);
        const data = await ComboService.updatePrice(id, price);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Price updated",
            data,
        });
    }),
};
//# sourceMappingURL=combo.controller.js.map