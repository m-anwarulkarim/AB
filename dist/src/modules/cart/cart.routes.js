import { Router } from "express";
import { CartController } from "./cart.controller.js";
const router = Router();
// all cart routes require login
router.get("/cart", CartController.getMyCart);
router.post("/cart/items", CartController.addItem);
router.patch("/cart/items/:comboId", CartController.updateQty);
router.delete("/cart/items/:comboId", CartController.removeItem);
router.delete("/cart/clear", CartController.clear);
export default router;
//# sourceMappingURL=cart.routes.js.map