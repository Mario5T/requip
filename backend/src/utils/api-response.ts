import { Response } from 'express';

/**
 * Standardized API Response Helper
 * Ensures consistent response format across all endpoints.
 */

interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

interface ApiResponseOptions<T> {
  res: Response;
  statusCode: number;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export function sendResponse<T>({
  res,
  statusCode,
  message,
  data,
  pagination,
}: ApiResponseOptions<T>): void {
  const response: Record<string, unknown> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Array<{ field: string; message: string }>,
): void {
  const response: Record<string, unknown> = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}
