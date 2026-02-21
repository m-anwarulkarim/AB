import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app: Application = express();

// ==========================================
// 1. Global Middleware
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://yourdomain.com"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. Application Routes
// ==========================================

app.get("/", (_req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Auth server is up and running! 🚀" });
});

// app.all("/api/auth/*", toNodeHandler(auth));

// ==========================================
// 3. Error Handling (Edge Cases)
// ==========================================

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found!",
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Server Error:", err.message || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    // In production, stack traces should be hidden
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
