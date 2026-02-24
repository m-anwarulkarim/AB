import { Router } from "express";
import { OrderController } from "./order.controller";
import authGuard from "../../lib/auth.guard";

const router = Router();

router.post("/orders/checkout", authGuard(), OrderController.checkout);
router.get("/orders", authGuard(), OrderController.myOrders);
router.get("/orders/:orderNo", authGuard(), OrderController.myOrderByNo);

export const orderRoutes = router;