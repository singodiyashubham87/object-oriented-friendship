import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import accountRouter from "./routers/account";
import connectionRequestRouter from "./routers/connectionRequest";
import userRouter from "./routers/user";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/account", accountRouter);
app.use("/user", userRouter);
app.use("/connection-request", connectionRequestRouter);

export default app;
