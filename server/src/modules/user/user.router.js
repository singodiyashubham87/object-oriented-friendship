import { Router } from "express";
const router = Router();

router.post("/signup", userController.signup);

export { router };
