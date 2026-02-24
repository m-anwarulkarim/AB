import { Router } from "express";
import { CartController } from "./cart.controller";
import authGuard from "../../lib/auth.guard";

const router = Router();

// all cart routes require login
router.get("/cart", authGuard(), CartController.getMyCart);

router.post("/cart/items", authGuard(), CartController.addItem);
router.patch("/cart/items/:comboId", authGuard(), CartController.updateQty);

router.delete("/cart/items/:comboId", authGuard(), CartController.removeItem);
router.delete("/cart/clear", authGuard(), CartController.clear);

export default router;