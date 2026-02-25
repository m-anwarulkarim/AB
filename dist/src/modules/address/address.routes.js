import { Router } from "express";
import { AddressController } from "./address.controller.js";
import authGuard from "../../lib/auth.guard.js";
const router = Router();
router.get("/addresses", authGuard(), AddressController.listMine);
router.post("/addresses", authGuard(), AddressController.create);
router.patch("/addresses/:id", authGuard(), AddressController.update);
router.patch("/addresses/:id/default", authGuard(), AddressController.setDefault);
router.delete("/addresses/:id", authGuard(), AddressController.remove);
export default router;
//# sourceMappingURL=address.routes.js.map