import { Router } from "express";
import authGuard from "../../lib/auth.guard.js";
import { OrderController } from "./order.controller.js";
const router = Router();

router.post("/orders/checkout", OrderController.checkout);
router.get("/orders", OrderController.myOrders);
router.get("/orders/:orderNo", OrderController.myOrderByNo);
router.post("/orders/preview", OrderController.preview);

export const orderRoutes = router;