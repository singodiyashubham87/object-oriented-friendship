import { Router } from "express";
import { isValidUser } from "../../utils/middleware.js";
import * as chatController from "./chat.controller.js";

const router = Router();

router.get("/", [isValidUser], chatController.getAllChats);
router.post("/:userId", [isValidUser], chatController.createChat);

export default router;
