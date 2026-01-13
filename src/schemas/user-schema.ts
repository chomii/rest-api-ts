import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const UserRegisterSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

export const UserRefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
