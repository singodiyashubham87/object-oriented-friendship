import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import * as messageController from "./message.controller.js";

const router = Router();

router.get("/:chatId", [isValidUser], messageController.getMessages);
router.put("/:messageId/read", [isValidUser], messageController.markAsRead);

export default router;
