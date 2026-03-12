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

router.get("/sessions", [isValidUser], authController.getSessions);
router.delete(
  "/sessions/all-others",
  [isValidUser],
  authController.revokeAllOtherSessions,
);
router.delete("/sessions/:id", [isValidUser], authController.revokeSession);
router.post("/refresh", authController.refreshAccessToken);

export default router;
