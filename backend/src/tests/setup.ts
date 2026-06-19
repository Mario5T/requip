/**
 * Jest Test Setup
 * Sets environment variables for testing before any tests run.
 */
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL = 'mysql://root:testpassword@localhost:3306/requip_test';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
process.env.LOG_LEVEL = 'error';
