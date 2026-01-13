import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const status = err.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal server error";

  res.status(status).json({ message });
};
