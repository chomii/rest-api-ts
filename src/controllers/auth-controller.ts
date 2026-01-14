import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import User from "../database/models/user.ts";
import {
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  RegisterRequestSchema,
} from "../schemas/user-schema.ts";
import { ApiError } from "../util/errors.ts";
import {
  generateAuthToken,
  generateRefreshToken,
  verifyAuthToken,
} from "../util/jwt.ts";
import { comparePassword, hashPassword } from "../util/password.ts";

type LoginPayload = z.infer<typeof LoginRequestSchema>;
type RefreshTokenPayload = z.infer<typeof RefreshTokenRequestSchema>;
type RegisterPayload = z.infer<typeof RegisterRequestSchema>;

export const login = async (
  req: Request<unknown, unknown, LoginPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      next(new ApiError("Invalid credentials", StatusCodes.UNAUTHORIZED));
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      next(new ApiError("Invalid credentials", StatusCodes.UNAUTHORIZED));
      return;
    }

    const payload = { userId: user.id };
    const token = generateAuthToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!token || !refreshToken) {
      next(
        new ApiError(
          "Could not generate authentication token",
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
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
      next(new ApiError("Email already in use", StatusCodes.BAD_REQUEST));
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
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const decoded = verifyAuthToken(refreshToken);
    const { userId } = decoded;

    const user = await User.findByPk(userId);
    if (user?.refreshToken !== refreshToken) {
      next(
        new ApiError(
          "Unauthorized: Invalid refresh token",
          StatusCodes.UNAUTHORIZED,
        ),
      );
      return;
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
    next(err);
  }
};
