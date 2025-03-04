import { Router } from "express";
import { router as bookmarkRouter } from "./modules/bookmark/bookmark.router.js";
import { router as chatRouter } from "./modules/chat/chat.router.js";
import { router as messageRouter } from "./modules/message/message.router.js";
import { router as requestRouter } from "./modules/request/request.router.js";
import { router as userRouter } from "./modules/user/user.router.js";

const router = Router();

router.use("/user", userRouter);
router.use("/request", requestRouter);
router.use("/bookmark", bookmarkRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

export { router };
