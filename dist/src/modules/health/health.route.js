// src/modules/health/health.route.ts
import { Router } from "express";
import { healthController } from "./health.controller.js";
const router = Router();
router.get("/", healthController);
export default router;
//# sourceMappingURL=health.route.js.map