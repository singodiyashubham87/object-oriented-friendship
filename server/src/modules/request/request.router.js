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
  "/accept/:userId",
  [isValidUser],
  requestController.acceptConnectionRequest,
);

router.put(
  "/reject/:userId",
  [isValidUser],
  requestController.rejectConnectionRequest,
);

router.delete(
  "/cancel/:requestId",
  [isValidUser],
  requestController.cancelConnectionRequest,
);

router.get("/pending", [isValidUser], requestController.getAllPendingRequests);

router.get("/sent", [isValidUser], requestController.getAllSentRequests);

export default router;
