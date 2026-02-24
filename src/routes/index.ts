// src/routes/index.ts

import { Router } from "express";
import healthRoute from "../modules/health/health.route";
import { authRoute } from "../modules/auth/auth.route";
import adminComboRoutes from "../modules/combo/admin.combo.routes";
import comboRoutes from "../modules/combo/combo.routes";
import cartRoutes from "../modules/cart/cart.routes";
import { orderRoutes } from "../modules/order/order.routes";
import adminOrderRoutes from "../modules/order/admin.order.routes";
import addressRoutes from "../modules/address/address.routes";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute)
router.use("/combos", comboRoutes);
router.use("/admin/combos", adminComboRoutes);
router.use(cartRoutes);
router.use(orderRoutes);
router.use(adminOrderRoutes);
router.use(addressRoutes);

export default router;