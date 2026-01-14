import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

export function validate(
  schema: z.ZodType,
  property: "body" | "params" | "query",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      next({
        errors: result.error.issues,
        message: result.error.message,
        status: StatusCodes.BAD_REQUEST,
      });
      return;
    }
    req[property] = result.data;
    next();
  };
}
