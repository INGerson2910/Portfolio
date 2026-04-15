import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  databaseUrl: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/lumastay",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  taxRate: Number(process.env.TAX_RATE || 0.16)
};