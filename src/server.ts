import { Server } from "http";
import app from "./app";

const PORT = process.env.PORT;

// Store the server instance in a variable so it can be controlled/shut down later if any error occurs
let server: Server;

/**
 * Main function to bootstrap (start) the application
 */
async function bootstrap() {
  try {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running smoothly on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
}

bootstrap();

// ==========================================
// Edge Cases & Critical Error Handling
// ==========================================

// Unhandled Promise Rejection (e.g., when an async/await function has no catch block)
process.on("unhandledRejection", (error) => {
  console.error(
    "🔥 Unhandled Rejection detected! Shutting down server...",
    error,
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Uncaught Exception (e.g., major error or typo in synchronous code)
process.on("uncaughtException", (error) => {
  console.error(
    "💥 Uncaught Exception detected! Shutting down immediately...",
    error,
  );
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("✅ Process terminated.");
    });
  }
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT (Ctrl+C) received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("✅ Process terminated.");
      process.exit(0);
    });
  }
});
