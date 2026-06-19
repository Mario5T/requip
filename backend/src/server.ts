import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { disconnectDatabase } from './config/database';

/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown.
 */
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`📚 API Docs available at http://localhost:${env.PORT}/api-docs`);
  logger.info(`❤️  Health check at http://localhost:${env.PORT}/health`);
});

// ─── Graceful Shutdown ───────────────────────────────────────
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectDatabase();
    logger.info('Graceful shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', { message: reason?.message, stack: reason?.stack });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', { message: error.message, stack: error.stack });
  process.exit(1);
});

export default server;
