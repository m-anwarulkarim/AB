import { Router } from "express";
import authGuard from "../../lib/auth.guard.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { OrderController } from "./order.controller.js";
const router = Router();
router.get("/admin/orders", authGuard(UserRole.ADMIN), OrderController.adminList);
router.patch("/admin/orders/:id/status", authGuard(UserRole.ADMIN), OrderController.adminUpdateStatus);
export default router;
//# sourceMappingURL=admin.order.routes.js.map