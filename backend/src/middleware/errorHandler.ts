import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Unhandled Application Error:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? 'An unexpected error occurred while analyzing the input. Please try again.'
      : err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
}
