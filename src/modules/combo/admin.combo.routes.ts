import { Router } from "express";
import { ComboController } from "./combo.controller";
import authGuard from "../../lib/auth.guard";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", authGuard(UserRole.ADMIN), ComboController.create);

router.patch("/:id", authGuard(UserRole.ADMIN), ComboController.update);

router.patch(
    "/:id/toggle",
    authGuard(UserRole.ADMIN),
    ComboController.toggle
);

router.patch(
    "/:id/stock",
    authGuard(UserRole.ADMIN),
    ComboController.updateStock
);

router.patch(
    "/:id/price",
    authGuard(UserRole.ADMIN),
    ComboController.updatePrice
);

export default router;