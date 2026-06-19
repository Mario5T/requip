import { Router } from 'express';
import userRoutes from './user.routes';

/**
 * Route Aggregator
 * Centralizes all route modules under versioned API prefix.
 */
const router = Router();

router.use('/users', userRoutes);

export default router;
