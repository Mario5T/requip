import winston from 'winston';
import { env } from './env';

/**
 * Winston Logger Configuration
 * - Console transport with colorized output in development
 * - JSON format in production for log aggregation
 * - File transports for error and combined logs
 */

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format:
      env.NODE_ENV === 'development'
        ? combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), devFormat)
        : combine(timestamp(), errors({ stack: true }), json()),
  }),
];

// File transports for non-test environments
if (env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: 'requip-api' },
  transports,
  // Prevent Winston from exiting on uncaught exceptions
  exitOnError: false,
});
