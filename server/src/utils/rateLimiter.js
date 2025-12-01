import rateLimit from "express-rate-limit";
import { isProd } from "./common.js";

const PROD_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const PROD_GENERAL_RATE_LIMIT = 100;
const PROD_AUTH_RATE_LIMIT = 50;

const DEV_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const DEV_GENERAL_RATE_LIMIT = 10000;
const DEV_AUTH_RATE_LIMIT = 5000;

const RATE_LIMIT_WINDOW = isProd
  ? PROD_RATE_LIMIT_WINDOW
  : DEV_RATE_LIMIT_WINDOW;
const GENERAL_RATE_LIMIT = isProd
  ? PROD_GENERAL_RATE_LIMIT
  : DEV_GENERAL_RATE_LIMIT;
const AUTH_RATE_LIMIT = isProd ? PROD_AUTH_RATE_LIMIT : DEV_AUTH_RATE_LIMIT;

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: GENERAL_RATE_LIMIT,
  message: {
    success: false,
    error: {
      message: "Too many requests from this IP, please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: AUTH_RATE_LIMIT,
  message: {
    success: false,
    error: {
      message:
        "Too many authentication attempts from this IP, please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
