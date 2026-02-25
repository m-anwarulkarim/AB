import { Router } from "express";
import { ComboController } from "./combo.controller.js";
const router = Router();
router.get("/", ComboController.listActive);
router.get("/:slug", ComboController.getBySlug);
export default router;
//# sourceMappingURL=combo.routes.js.map