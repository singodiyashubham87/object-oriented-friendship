import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import * as userController from "./user.controller.js";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", [isValidUser], userController.logout);
router.put("/update/:id", [isValidUser], userController.updateUser);
router.delete("/delete/:id", [isValidUser], userController.deleteUser);
router.post("/reset-password", [isValidUser], userController.resetPassword);
router.post("/verify-phone/:id", [isValidUser], userController.verifyPhone);
router.get("/me", [isValidUser], userController.getCurrentUser);
router.get("/friends", [isValidUser], userController.getFriends);
router.delete("/unfriend/:friendId", [isValidUser], userController.unfriend);
router.get("/feed", [isValidUser], userController.getUserFeed);

export default router;
