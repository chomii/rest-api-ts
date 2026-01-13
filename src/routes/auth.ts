import express from "express";

import {
  login,
  refreshToken,
  register,
} from "../controllers/auth-controller.ts";
import {
  UserLoginSchema,
  UserRefreshTokenSchema,
  UserRegisterSchema,
} from "../schemas/user-schema.ts";
import { validate } from "../util/validation.ts";

const router = express.Router();

router.post("/login", validate(UserLoginSchema, "body"), login);
router.post("/register", validate(UserRegisterSchema, "body"), register);
router.post("/refresh", validate(UserRefreshTokenSchema, "body"), refreshToken);

export default router;
