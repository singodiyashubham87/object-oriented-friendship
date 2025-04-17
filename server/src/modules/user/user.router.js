import * as userController from "./user.controller.js";

import { Router } from "express";
const router = Router();

router.post("/register", userController.register);

export default router;
