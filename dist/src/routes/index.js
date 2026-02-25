// src/routes/index.ts
import { Router } from "express";
import healthRoute from "../modules/health/health.route.js";
import { authRoute } from "../modules/auth/auth.route.js";
import adminComboRoutes from "../modules/combo/admin.combo.routes.js";
import comboRoutes from "../modules/combo/combo.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import { orderRoutes } from "../modules/order/order.routes.js";
import adminOrderRoutes from "../modules/order/admin.order.routes.js";
import addressRoutes from "../modules/address/address.routes.js";
const router = Router();
router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/combos", comboRoutes);
router.use("/admin/combos", adminComboRoutes);
router.use(cartRoutes);
router.use(orderRoutes);
router.use(adminOrderRoutes);
router.use(addressRoutes);
export default router;
//# sourceMappingURL=index.js.map