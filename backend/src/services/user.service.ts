import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput, UpdateUserInput, UserQueryParams, PaginatedResult } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { ERROR_MESSAGES } from '../utils/constants';
import { logger } from '../config/logger';

/**
 * User Service
 * Contains all business logic for user operations.
 * Validates business rules before delegating to the repository.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Create a new user.
   * Checks for duplicate email, Aadhaar, and PAN before creating.
   */
  async createUser(data: CreateUserInput): Promise<User> {
    logger.info('Creating new user', { email: data.email });

    // Check for duplicate email
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw ApiError.conflict(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    // Check for duplicate Aadhaar
    const existingAadhaar = await this.userRepository.findByAadhaar(data.aadhaar);
    if (existingAadhaar) {
      throw ApiError.conflict(ERROR_MESSAGES.AADHAAR_EXISTS);
    }

    // Check for duplicate PAN
    const existingPan = await this.userRepository.findByPan(data.pan);
    if (existingPan) {
      throw ApiError.conflict(ERROR_MESSAGES.PAN_EXISTS);
    }

    const user = await this.userRepository.create(data);
    logger.info('User created successfully', { userId: user.id });
    return user;
  }

  /**
   * Get a user by ID.
   * Throws 404 if user not found or is deleted.
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * Get all users with pagination, sorting, and search.
   */
  async getUsers(params: UserQueryParams): Promise<PaginatedResult<User>> {
    logger.debug('Fetching users', { params });
    return this.userRepository.findAll(params);
  }

  /**
   * Update a user by ID.
   * Supports partial updates. Checks for uniqueness conflicts on email, Aadhaar, and PAN.
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    logger.info('Updating user', { userId: id });

    // Verify user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check for duplicate email if updating email
    if (data.email && data.email !== existingUser.email) {
      const emailConflict = await this.userRepository.findByEmail(data.email, id);
      if (emailConflict) {
        throw ApiError.conflict(ERROR_MESSAGES.EMAIL_EXISTS);
      }
    }

    // Check for duplicate Aadhaar if updating Aadhaar
    if (data.aadhaar && data.aadhaar !== existingUser.aadhaar) {
      const aadhaarConflict = await this.userRepository.findByAadhaar(data.aadhaar, id);
      if (aadhaarConflict) {
        throw ApiError.conflict(ERROR_MESSAGES.AADHAAR_EXISTS);
      }
    }

    // Check for duplicate PAN if updating PAN
    if (data.pan && data.pan !== existingUser.pan) {
      const panConflict = await this.userRepository.findByPan(data.pan, id);
      if (panConflict) {
        throw ApiError.conflict(ERROR_MESSAGES.PAN_EXISTS);
      }
    }

    const updatedUser = await this.userRepository.update(id, data, existingUser.version);
    logger.info('User updated successfully', { userId: id, version: updatedUser.version });
    return updatedUser;
  }

  /**
   * Soft delete a user by ID.
   * Sets isDeleted=true and populates deletedAt timestamp.
   */
  async deleteUser(id: string): Promise<User> {
    logger.info('Soft deleting user', { userId: id });

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.isDeleted) {
      throw ApiError.badRequest(ERROR_MESSAGES.USER_ALREADY_DELETED);
    }

    const deletedUser = await this.userRepository.softDelete(id);
    logger.info('User soft deleted successfully', { userId: id });
    return deletedUser;
  }
}
