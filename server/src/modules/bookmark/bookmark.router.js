import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import * as bookmarkController from "./bookmark.controller.js";

const router = Router();

router.post("/:userId", [isValidUser], bookmarkController.createBookmark);
router.delete("/:userId", [isValidUser], bookmarkController.deleteBookmark);
router.get("/", [isValidUser], bookmarkController.getBookmarkedUsers);

export default router;
