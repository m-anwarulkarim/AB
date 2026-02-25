import { app } from "./app.js";
import { envVars } from "./config/env.js";

const server = app.listen(envVars.PORT, () => {
  console.log(
    `🚀 Server running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`,
  );
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    process.exit(0);
  });
});
