import dotenv from "dotenv";
import path from "path";
import status from "http-status";
import AppError from "../utils/AppError.js";

dotenv.config({ path: path.join(process.cwd(), ".env") });

type NodeEnv = "development" | "production" | "test";

interface EnvConfig {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
}

/**
 * Helper: read env safely
 */
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new AppError(
      status.BAD_REQUEST,
      `❌ Missing environment variable: ${key}`,
    );
  }
  return value;
};

/**
 * Helper: validate NODE_ENV
 */
const parseNodeEnv = (value: string): NodeEnv => {
  const allowed: NodeEnv[] = ["development", "production", "test"];
  if (!allowed.includes(value as NodeEnv)) {
    throw new AppError(
      status.BAD_REQUEST,
      `❌ Invalid NODE_ENV: "${value}". Allowed: ${allowed.join(", ")}`,
    );
  }
  return value as NodeEnv;
};

/**
 * Helper: parse PORT safely
 */
const parsePort = (value: string): number => {
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0) {
    throw new AppError(
      status.BAD_REQUEST,
      `❌ Invalid PORT: "${value}". PORT must be a positive integer`,
    );
  }
  return port;
};

/**
 * ২. লোড এবং ভ্যালিডেশন ফাংশন
 */
const loadEnvVariables = (): EnvConfig => {
  const requiredEnv = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "FRONTEND_URL",
  ] as const;

  // Missing check (clean message)
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new AppError(
      status.BAD_REQUEST,
      `❌ .env ফাইলে এই ভেরিয়েবলগুলো নেই: ${missing.join(", ")}`,
    );
  }

  // All good -> return typed config
  return {
    NODE_ENV: parseNodeEnv(getEnv("NODE_ENV")),
    PORT: parsePort(getEnv("PORT")),
    DATABASE_URL: getEnv("DATABASE_URL"),
    BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
    FRONTEND_URL: getEnv("FRONTEND_URL"),
  };
};

// ৩. পুরো প্রজেক্টে ব্যবহারের জন্য এক্সপোর্ট
export const envVars = loadEnvVariables();
