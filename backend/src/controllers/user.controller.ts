import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendResponse } from '../utils/api-response';
import { SUCCESS_MESSAGES } from '../utils/constants';
import { CreateUserInput, UpdateUserInput, UserQueryParams } from '../models/user.model';

/** Helper to safely extract a single string param from Express req.params */
function getParam(params: Record<string, unknown>, key: string): string {
  const val = params[key];
  return Array.isArray(val) ? val[0] : (val as string);
}

/**
 * User Controller
 * Handles HTTP request/response only.
 * All business logic is delegated to UserService.
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /api/v1/users
   * Create a new user.
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateUserInput = req.body;
      const user = await this.userService.createUser(data);
      sendResponse({ res, statusCode: 201, message: SUCCESS_MESSAGES.USER_CREATED, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users
   * Get all users with pagination, sorting, and search.
   */
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: UserQueryParams = req.query as unknown as UserQueryParams;
      const result = await this.userService.getUsers(params);
      sendResponse({
        res,
        statusCode: 200,
        message: SUCCESS_MESSAGES.USERS_FETCHED,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/:id
   * Get a user by ID.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params, 'id');
      const user = await this.userService.getUserById(id);
      sendResponse({ res, statusCode: 200, message: SUCCESS_MESSAGES.USER_FETCHED, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/:id
   * Update a user by ID (supports partial updates).
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params, 'id');
      const data: UpdateUserInput = req.body;
      const user = await this.userService.updateUser(id, data);
      sendResponse({ res, statusCode: 200, message: SUCCESS_MESSAGES.USER_UPDATED, data: user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/users/:id
   * Soft delete a user by ID.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params, 'id');
      await this.userService.deleteUser(id);
      sendResponse({ res, statusCode: 200, message: SUCCESS_MESSAGES.USER_DELETED });
    } catch (error) {
      next(error);
    }
  };
}
