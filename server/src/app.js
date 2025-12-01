import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import baseRouter from "./router.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
import { generalLimiter } from "./utils/rateLimiter.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup morgan for logging all HTTP requests
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

app.use("/api/", generalLimiter);
app.use("/api/", baseRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
