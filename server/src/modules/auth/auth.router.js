import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import { authLimiter } from "../../utils/rateLimiter.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", [isValidUser], authController.logout);

router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.get("/verify", [isValidUser], authController.verifyToken);

export default router;
