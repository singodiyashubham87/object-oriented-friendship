import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import { router as baseRouter } from "./router.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/", baseRouter);
app.get("/", (req, res) => {
	res.json({ message: "Hello from Backend!" });
});

export default app;
