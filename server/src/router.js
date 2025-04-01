import { Router } from "express";
import bookmarkRouter from "./modules/bookmark/bookmark.router.js";
import chatRouter from "./modules/chat/chat.router.js";
import messageRouter from "./modules/message/message.router.js";
import requestRouter from "./modules/request/request.router.js";
import userRouter from "./modules/user/user.router.js";

const router = Router();

router.use("/user", userRouter);
router.use("/request", requestRouter);
router.use("/bookmark", bookmarkRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

export default router;
