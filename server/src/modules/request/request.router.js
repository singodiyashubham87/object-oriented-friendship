import { Router } from "express";
const router = Router();
import { isValidUser } from "../../utils/middleware.js";
import * as requestController from "./request.controller.js";

router.post(
  "/send/:toUserId",
  [isValidUser],
  requestController.sendConnectionRequest,
);

router.put(
  "/accept/:requestId",
  [isValidUser],
  requestController.acceptConnectionRequest,
);

router.put(
  "/reject/:requestId",
  [isValidUser],
  requestController.rejectConnectionRequest,
);

export default router;
