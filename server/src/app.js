import "dotenv/config";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import baseRouter from "./router.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
import { generalLimiter } from "./utils/rateLimiter.js";

// Configure Cloudinary for profile picture storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Trust proxy - required when running behind reverse proxies like Render
// This allows express-rate-limit to correctly identify client IPs
app.set("trust proxy", 1);

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
