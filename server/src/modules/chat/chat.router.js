import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from chat module!" });
});

export default router;
