import type { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CartService } from "./cart.service.js";
import { addToCartSchema, updateQtySchema } from "./cart.validation.js";

export const CartController = {
    // ✅ GET /cart
    getMyCart: catchAsync(async (req: Request, res: Response) => {
        const userId = CartService.getUserIdFromReqUser((req as any).user);

        const data = await CartService.getMyCart(userId);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Cart fetched",
            data,
        });
    }),

    // ✅ POST /cart/items
    addItem: catchAsync(async (req: Request, res: Response) => {
        const userId = CartService.getUserIdFromReqUser((req as any).user);

        const payload = addToCartSchema.parse(req.body);

        const data = await CartService.addItemToCart(userId, payload as any);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Item added to cart",
            data,
        });
    }),

    // ✅ PATCH /cart/items/:comboId
    updateQty: catchAsync(async (req: Request, res: Response) => {
        const userId = CartService.getUserIdFromReqUser((req as any).user);

        const { comboId } = req.params;
        const payload = updateQtySchema.parse(req.body);

        const data = await CartService.updateItemQty(userId, comboId as string, payload);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Cart item quantity updated",
            data,
        });
    }),

    // ✅ DELETE /cart/items/:comboId
    removeItem: catchAsync(async (req: Request, res: Response) => {
        const userId = CartService.getUserIdFromReqUser((req as any).user);

        const { comboId } = req.params;

        const data = await CartService.removeItem(userId, comboId as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Item removed from cart",
            data,
        });
    }),

    // ✅ DELETE /cart/clear
    clear: catchAsync(async (req: Request, res: Response) => {
        const userId = CartService.getUserIdFromReqUser((req as any).user);

        const data = await CartService.clearCart(userId);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Cart cleared",
            data,
        });
    }),
};