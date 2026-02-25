import { Router } from "express";
import authGuard from "../../lib/auth.guard.js";
import { OrderController } from "./order.controller.js";
const router = Router();

router.post("/orders/checkout", authGuard(), OrderController.checkout);
router.get("/orders", authGuard(), OrderController.myOrders);
router.get("/orders/:orderNo", authGuard(), OrderController.myOrderByNo);
router.post("/orders/preview", authGuard(), OrderController.preview);

export const orderRoutes = router;