import { Router } from "express";
import { ComboController } from "./combo.controller.js";
import authGuard from "../../lib/auth.guard.js";

const router = Router();

router.get("/", authGuard(), ComboController.listActive);
router.get("/:slug", authGuard(), ComboController.getBySlug);

export default router;
