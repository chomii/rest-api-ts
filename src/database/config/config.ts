import { SignOptions } from "jsonwebtoken";
import { Dialect } from "sequelize";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not provided.`,
    );
  }
  return value;
}

export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const BASE_URL = process.env.BASE_URL ?? "/api/v1";
export const PORT = process.env.PORT ?? "3000";

export const DB_DIALECT = (process.env.DB_DIALECT ?? "postgres") as Dialect;
export const DB_NAME = requireEnv("DB_NAME");
export const DB_USERNAME = requireEnv("DB_USERNAME");
export const DB_PASSWORD = requireEnv("DB_PASSWORD");
export const DB_HOST = requireEnv("DB_HOST");
export const DB_PORT = Number(requireEnv("DB_PORT"));

export const JWT_SECRET = requireEnv("JWT_SECRET");

export const JWT_AUTH_TOKEN_EXPIRES = (process.env.JWT_AUTH_TOKEN_EXPIRES ??
  "1h") as SignOptions["expiresIn"];
export const JWT_REFRESH_TOKEN_EXPIRES = (process.env
  .JWT_REFRESH_TOKEN_EXPIRES ?? "7d") as SignOptions["expiresIn"];
