import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import * as userController from "./user.controller.js";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
router.post("/reset-password", userController.resetPassword);
router.post("/verify-phone/:id", userController.verifyPhone);
router.get("/me", [isValidUser], userController.getCurrentUser);

export default router;
