import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { notFound } from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./routes";

export const app = express();

// 🔐 Security
app.use(helmet());

// 🌍 CORS
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
}));

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