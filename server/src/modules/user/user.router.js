import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import { upload } from "../../utils/multer.js";
import * as userController from "./user.controller.js";

const router = Router();

router.put("/:id", [isValidUser], userController.updateUser);
router.delete("/:id", [isValidUser], userController.deleteUser);

router.post("/verify-phone/:id", [isValidUser], userController.verifyPhone);

// Specific GET routes must come BEFORE dynamic /:id route
router.get("/me", [isValidUser], userController.getCurrentUser);
router.get("/friends", [isValidUser], userController.getFriends);
router.get("/feed", [isValidUser], userController.getUserFeed);
router.get("/search", [isValidUser], userController.searchUsers);

router.post(
  "/upload-avatar",
  [isValidUser, upload.single("avatar")],
  userController.uploadAvatar,
);

// Dynamic route - must be last among GET routes
router.get("/:id", [isValidUser], userController.getUserById);
router.delete("/unfriend/:friendId", [isValidUser], userController.unfriend);

export default router;
