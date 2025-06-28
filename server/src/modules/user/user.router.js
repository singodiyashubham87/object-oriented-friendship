import { Router } from "express";
import * as userController from "./user.controller.js";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forgot-password", userController.forgotPassword);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;
