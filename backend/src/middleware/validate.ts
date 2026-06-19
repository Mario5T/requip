import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/api-error';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Zod Validation Middleware Factory
 * Creates middleware that validates request body, query, or params against a Zod schema.
 * Transforms Zod errors into structured ApiError format.
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed (and potentially transformed) data
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(ApiError.badRequest(ERROR_MESSAGES.VALIDATION_FAILED, validationErrors));
      } else {
        next(error);
      }
    }
  };
}
