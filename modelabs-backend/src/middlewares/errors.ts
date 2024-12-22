import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  console.error(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error'
  });
};