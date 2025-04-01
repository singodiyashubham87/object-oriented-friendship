import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from message module!" });
});

export default router;
