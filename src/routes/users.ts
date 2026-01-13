import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jsonwebtoken from "jsonwebtoken";

import { getCurrentUser } from "../controllers/users-controller.ts";
import { JWT_SECRET } from "../database/config/config.ts";
import { getAuthToken } from "../util/jwt.ts";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  // Middleware logic to validate token
  const token = getAuthToken(req);

  if (!token) {
    next({
      message: "Unauthorized: No token provided",
      status: StatusCodes.UNAUTHORIZED,
    });
    return;
  }

  const isTokenValid = jsonwebtoken.verify(token, JWT_SECRET);
  if (!isTokenValid) {
    next({
      message: "Unauthorized: Invalid token",
      status: StatusCodes.UNAUTHORIZED,
    });
    return;
  }
  next();
};

const router = express.Router();

router.get("/me", validateToken, getCurrentUser);

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   res.json({ message: `User ID: ${id}` });
// });

export default router;
