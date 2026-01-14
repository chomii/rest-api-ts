import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import User from "../database/models/user.ts";
import { ApiError } from "../util/errors.ts";
import { getAuthToken, verifyAuthToken } from "../util/jwt.ts";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getAuthToken(req);

  if (!token) {
    next(
      new ApiError("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED),
    );
    return;
  }

  try {
    const decoded = verifyAuthToken(token);

    const { userId } = decoded;
    const currentUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!currentUser) {
      next(new ApiError("User not found", StatusCodes.NOT_FOUND));
      return;
    }

    return res.json(currentUser);
  } catch (err) {
    next(err);
  }
};
