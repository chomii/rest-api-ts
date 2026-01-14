import { Request } from "express";
import jsonwebtoken from "jsonwebtoken";

import {
  JWT_AUTH_TOKEN_EXPIRES,
  JWT_REFRESH_TOKEN_EXPIRES,
  JWT_SECRET,
} from "../database/config/config.ts";

export interface GenerateTokenPayload {
  userId: number | string;
}

export interface JwtPayload {
  userId: string;
}

export const generateAuthToken = (payload: GenerateTokenPayload): string => {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: JWT_AUTH_TOKEN_EXPIRES,
  });
};

export const generateRefreshToken = (payload: GenerateTokenPayload): string => {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
  });
};

export const getAuthToken = (req: Request): null | string => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1] || null;
};

export const verifyAuthToken = (token: string): JwtPayload => {
  return jsonwebtoken.verify(token, JWT_SECRET) as JwtPayload;
};
