/**
 * Application-wide Constants
 * Centralizes magic strings and default values.
 */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const SORTABLE_FIELDS = ['name', 'email', 'createdAt', 'updatedAt'] as const;

export const VALIDATION_PATTERNS = {
  AADHAAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
  MOBILE: /^\+?[1-9]\d{9,14}$/,
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_DELETED: 'User has already been deleted',
  EMAIL_EXISTS: 'A user with this email already exists',
  AADHAAR_EXISTS: 'A user with this Aadhaar number already exists',
  PAN_EXISTS: 'A user with this PAN number already exists',
  MOBILE_EXISTS: 'A user with this mobile number already exists',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_FETCHED: 'User retrieved successfully',
  USERS_FETCHED: 'Users retrieved successfully',
} as const;

export const API_PREFIX = '/api/v1' as const;
