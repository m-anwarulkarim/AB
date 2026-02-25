import winston from "winston";
import fs from "fs";
import path from "path";
import { envVars } from "./env.js";

// ==============================
// Ensure logs directory exists
// ==============================
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ==============================
// Define log format
// ==============================
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }),
);

// ==============================
// Create Logger
// ==============================
const logger = winston.createLogger({
  level: envVars.NODE_ENV === "production" ? "info" : "debug",

  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

// ==============================
// Console Transport (Dev Only)
// ==============================
if (envVars.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  );
}

export default logger;
