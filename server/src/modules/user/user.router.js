import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
	res.json({ message: "Hello from user module!" });
});

router.post("/signup", userController.signup);

export { router };
