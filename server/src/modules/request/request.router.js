import { Router } from "express";
const router = Router();
import { isValidUser } from "../../utils/middleware.js";
import * as requestController from "./request.controller.js";

router.post(
  "/send/:toUserId",
  [isValidUser],
  requestController.sendConnectionRequest,
);

export default router;
