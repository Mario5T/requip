import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { validate } from '../middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  queryUsersSchema,
  idParamSchema,
} from '../validators/user.validator';

/**
 * User Routes
 * Wires validators, controller methods, and dependency injection.
 * No business logic here — only route definitions.
 */

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.post('/', validate(createUserSchema, 'body'), userController.createUser);

router.get('/', validate(queryUsersSchema, 'query'), userController.getUsers);

router.get('/:id', validate(idParamSchema, 'params'), userController.getUserById);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateUserSchema, 'body'),
  userController.updateUser,
);

router.delete('/:id', validate(idParamSchema, 'params'), userController.deleteUser);

export default router;
