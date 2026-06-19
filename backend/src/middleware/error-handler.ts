import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { sendError } from '../utils/api-response';
import { logger } from '../config/logger';
import { env } from '../config/env';

/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the application and returns a consistent response.
 * Distinguishes between operational errors (expected) and programming errors (unexpected).
 */
export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log the error
  if (err instanceof ApiError && err.isOperational) {
    logger.warn(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      errors: err.errors,
    });
  } else {
    logger.error('Unexpected Error:', {
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle known ApiError
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // Handle Prisma-specific errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.join(', ') || 'field';
      sendError(res, 409, `A record with this ${target} already exists`);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 404, 'Record not found');
      return;
    }
  }

  // Fallback for unexpected errors
  const statusCode = 500;
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  sendError(res, statusCode, message);
}
