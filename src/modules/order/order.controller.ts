import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { OrderService } from "./order.service.js";
import { checkoutSchema, updateOrderStatusSchema } from "./order.validation.js";
import { OrderStatus } from "../../../generated/prisma/enums.js";

export const OrderController = {
  // ✅ POST /orders/checkout
  checkout: catchAsync(async (req: Request, res: Response) => {
    const userId = OrderService.getUserId(req.user);
    const payload = checkoutSchema.parse(req.body);

    const data = await OrderService.checkout(userId, payload as any);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Order created",
      data,
    });
  }),

  // ✅ GET /orders
  myOrders: catchAsync(async (req: Request, res: Response) => {
    const userId = OrderService.getUserId(req.user);

    const data = await OrderService.myOrders(userId);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Orders fetched",
      data,
    });
  }),

  // ✅ GET /orders/:orderNo
  myOrderByNo: catchAsync(async (req: Request, res: Response) => {
    const userId = OrderService.getUserId(req.user);
    const { orderNo } = req.params;

    const data = await OrderService.myOrderByNo(userId, orderNo as string);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order fetched",
      data,
    });
  }),

  // ✅ Admin: GET /admin/orders?status=PENDING
  adminList: catchAsync(async (req: Request, res: Response) => {
    const q = req.query.status as string | undefined;
    const statusFilter = q ? (q as OrderStatus) : undefined;

    const data = await OrderService.adminListOrders(statusFilter);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin orders fetched",
      data,
    });
  }),

  // ✅ Admin: PATCH /admin/orders/:id/status
  adminUpdateStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = updateOrderStatusSchema.parse(req.body);

    const data = await OrderService.adminUpdateStatus(id as string, payload);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order status updated",
      data,
    });
  }),
  // ✅ POST /orders/preview
  // ✅ POST /orders/preview
  preview: catchAsync(async (req: Request, res: Response) => {
    const userId = OrderService.getUserId(req.user);
    const payload = checkoutSchema.parse(req.body);

    const data = await OrderService.previewCheckout(userId, payload as any);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Checkout preview",
      data,
    });
  }),
};
