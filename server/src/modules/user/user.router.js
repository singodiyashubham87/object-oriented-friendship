import { userController } from "./user.controller.js";

import { Router } from "express";
const router = Router();

router.post("/signup", userController.signup);

export default router;
