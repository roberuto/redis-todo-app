import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";
import { HttpError } from "../errors/http.error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      stack: err.stack
    });
  }

  if (err instanceof AppError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      stack: err.stack
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Unknown error",
    stack: err.stack
  });
};
