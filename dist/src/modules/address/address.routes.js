import { Router } from "express";
import { AddressController } from "./address.controller.js";
const router = Router();
router.get("/addresses", AddressController.listMine);
router.post("/addresses", AddressController.create);
router.patch("/addresses/:id", AddressController.update);
router.patch("/addresses/:id/default", AddressController.setDefault);
router.delete("/addresses/:id", AddressController.remove);
export default router;
//# sourceMappingURL=address.routes.js.map