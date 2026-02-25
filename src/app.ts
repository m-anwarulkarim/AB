import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { envVars } from "./config/env.js";
import router from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

export const app = express();

// 🔐 Security
app.use(helmet());

// 🌍 CORS
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", envVars.FRONTEND_URL],
  }),
);

// 🧠 Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📜 Logger
app.use(morgan("dev"));

// 📦 Routes
app.use("/api", router);

// ❌ 404 handler
app.use(notFound);

// 🚨 Global Error Handler
app.use(globalErrorHandler);
