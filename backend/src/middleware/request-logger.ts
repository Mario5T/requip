import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * HTTP Request/Response Logger Middleware
 * Logs incoming requests and outgoing responses with timing information.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log incoming request
  logger.http(`→ ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'http';

    logger[level](`← ${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`);
  });

  next();
}
