import express from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  refreshToken,
  register,
} from "../controllers/auth-controller.ts";
import {
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  RegisterRequestSchema,
} from "../schemas/user-schema.ts";
import { validate } from "../util/validation.ts";

const router = express.Router();
const authLimiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    "Too many authentication attempts from this IP, please try again after 15 minutes",
  windowMs: 15 * 60 * 1000, // 15 minutes
});

router.use(authLimiter);

router.post("/login", validate(LoginRequestSchema, "body"), login);
router.post("/register", validate(RegisterRequestSchema, "body"), register);
router.post(
  "/refresh",
  validate(RefreshTokenRequestSchema, "body"),
  refreshToken,
);

export default router;
