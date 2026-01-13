import express from "express";

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

router.post("/login", validate(LoginRequestSchema, "body"), login);
router.post("/register", validate(RegisterRequestSchema, "body"), register);
router.post(
  "/refresh",
  validate(RefreshTokenRequestSchema, "body"),
  refreshToken,
);

export default router;
