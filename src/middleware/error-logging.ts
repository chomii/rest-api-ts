import { NextFunction, Request, Response } from "express";

export const errorLoggerMiddleware = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.log.error(`Error occurred: ${err.message}`);
  next(err);
};
