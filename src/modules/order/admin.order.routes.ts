import { Router } from "express";
import authGuard from "../../lib/auth.guard";
import { UserRole } from "../../../generated/prisma/browser";
import { OrderController } from "./order.controller";


const router = Router();

router.get("/admin/orders", authGuard(UserRole.ADMIN), OrderController.adminList);
router.patch("/admin/orders/:id/status", authGuard(UserRole.ADMIN), OrderController.adminUpdateStatus);

export default router;