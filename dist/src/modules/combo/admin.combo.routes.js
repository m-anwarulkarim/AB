import { Router } from "express";
import { ComboController } from "./combo.controller.js";
import authGuard from "../../lib/auth.guard.js";
import { UserRole } from "../../../generated/prisma/enums.js";
const router = Router();
router.post("/", authGuard(UserRole.ADMIN), ComboController.create);
router.patch("/:id", authGuard(UserRole.ADMIN), ComboController.update);
router.patch("/:id/toggle", authGuard(UserRole.ADMIN), ComboController.toggle);
router.patch("/:id/stock", authGuard(UserRole.ADMIN), ComboController.updateStock);
router.patch("/:id/price", authGuard(UserRole.ADMIN), ComboController.updatePrice);
export default router;
//# sourceMappingURL=admin.combo.routes.js.map