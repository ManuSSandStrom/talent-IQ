import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLERK_PUBLISHABLE_KEY:
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.VITE_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  OPENROUTER_API_KEY:
    process.env.OPENROUTER_API_KEY ||
    "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",
};

// Validate required environment values (checks the resolved ENV values, not raw process.env)
const requiredEnvValues = {
  CLERK_PUBLISHABLE_KEY: ENV.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: ENV.CLERK_SECRET_KEY,
  DB_URL: ENV.DB_URL,
  STREAM_API_KEY: ENV.STREAM_API_KEY,
  STREAM_API_SECRET: ENV.STREAM_API_SECRET,
  EMAIL_USER: ENV.EMAIL_USER,
  EMAIL_PASS: ENV.EMAIL_PASS,
};

const missing = Object.entries(requiredEnvValues)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error(
    "❌ CRITICAL ERROR: Missing environment variables:",
    missing.join(", "),
  );
  console.error(
    "Please ensure your .env file exists in the 'backend' directory and contains these keys.",
  );
  console.error(
    "Note: VITE_CLERK_PUBLISHABLE_KEY or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY can be used as fallback for CLERK_PUBLISHABLE_KEY",
  );
} else {
  console.log("✅ Environment variables loaded successfully");
}
