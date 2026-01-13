import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jsonwebtoken from "jsonwebtoken";
import { z } from "zod";

import { JWT_SECRET } from "../database/config/config.ts";
import User from "../database/models/user.ts";
import {
  UserLoginSchema,
  UserRefreshTokenSchema,
  UserRegisterSchema,
} from "../schemas/user-schema.ts";
import { generateAuthToken, generateRefreshToken } from "../util/jwt.ts";
import { comparePassword, hashPassword } from "../util/password.ts";

type LoginPayload = z.infer<typeof UserLoginSchema>;
type RefreshTokenPayload = z.infer<typeof UserRefreshTokenSchema>;
type RegisterPayload = z.infer<typeof UserRegisterSchema>;

export const login = async (
  req: Request<unknown, unknown, LoginPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      next({
        message: "Invalid credentials",
        status: StatusCodes.UNAUTHORIZED,
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      next({
        message: "Invalid credentials",
        status: StatusCodes.UNAUTHORIZED,
      });
      return;
    }

    const payload = { userId: user.id };
    const token = generateAuthToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!token || !refreshToken) {
      next({
        message: "Could not generate authentication token",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
      return;
    }

    user.refreshToken = refreshToken;
    await user.save();

    res.status(StatusCodes.OK).json({
      auth_token: token,
      message: "Login successful",
      refresh_token: refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request<unknown, unknown, RegisterPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const userAlreadyExists = await User.findOne({ where: { email } });

    if (userAlreadyExists) {
      next({
        message: "Email already in use",
        status: StatusCodes.BAD_REQUEST,
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const payload = { userId: newUser.id };
    const token = generateAuthToken(payload);
    const refreshToken = generateRefreshToken(payload);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res.status(StatusCodes.CREATED).json({
      access_token: token,
      message: "User registered successfully",
      refresh_token: refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request<unknown, unknown, RefreshTokenPayload>,
  res: Response,
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized: No token provided" });
  }

  try {
    const { userId } = jsonwebtoken.verify(refreshToken, JWT_SECRET) as {
      userId: string;
    };

    const user = await User.findByPk(userId);

    if (user?.refreshToken !== refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized: User not found" });
    }

    const newAuthToken = generateAuthToken({ userId });
    const newRefreshToken = generateRefreshToken({ userId });
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(StatusCodes.OK).json({
      auth_token: newAuthToken,
      refresh_token: newRefreshToken,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unauthorized: Invalid token";
    return res.status(StatusCodes.UNAUTHORIZED).json({ message });
  }
};
