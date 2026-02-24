import { Router } from "express";
import { AddressController } from "./address.controller";
import authGuard from "../../lib/auth.guard";

const router = Router();

router.get("/addresses", authGuard(), AddressController.listMine);
router.post("/addresses", authGuard(), AddressController.create);

router.patch("/addresses/:id", authGuard(), AddressController.update);
router.patch("/addresses/:id/default", authGuard(), AddressController.setDefault);

router.delete("/addresses/:id", authGuard(), AddressController.remove);

export default router;