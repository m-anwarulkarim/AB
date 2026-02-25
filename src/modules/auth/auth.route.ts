import { Router } from "express";
import { authController } from "./auth.controller.js";
import authGuard from "../../lib/auth.guard.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  signInSchema,
  signUpSchema,
  refreshSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(signUpSchema),
  authController.signUpEmail,
);
router.post(
  "/login",
  validateRequest(signInSchema),
  authController.signInEmail,
);

// JWT system এ sign-out শুধু client-side token delete.
// তবুও endpoint রাখতে চাইলে protected রেখেছি
router.post("/sign-out", authGuard(), authController.signOut);

// refresh endpoint
router.post("/refresh", validateRequest(refreshSchema), authController.refresh);

export const authRoute = router;
