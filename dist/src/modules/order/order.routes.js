import { Router } from "express";
import { OrderController } from "./order.controller.js";
const router = Router();
router.post("/orders/checkout", OrderController.checkout);
router.get("/orders", OrderController.myOrders);
router.get("/orders/:orderNo", OrderController.myOrderByNo);
router.post("/orders/preview", OrderController.preview);
export const orderRoutes = router;
//# sourceMappingURL=order.routes.js.map