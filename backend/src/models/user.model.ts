import { Gender, UserStatus } from '@prisma/client';

/**
 * User Domain Types
 * TypeScript interfaces matching the Prisma User model.
 */

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile: string | null;
  aadhaar: string;
  pan: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  gender: Gender | null;
  profilePhotoUrl: string | null;
  status: UserStatus;
  emailVerified: boolean;
  mobileVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  version: number;
  createdBy: string;
  updatedBy: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile?: string;
  aadhaar: string;
  pan: string;
  dateOfBirth: string; // ISO date string
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  gender?: Gender;
  profilePhotoUrl?: string;
  status?: UserStatus;
  createdBy: string;
  updatedBy?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  primaryMobile?: string;
  secondaryMobile?: string | null;
  aadhaar?: string;
  pan?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  currentAddress?: string;
  permanentAddress?: string;
  gender?: Gender | null;
  profilePhotoUrl?: string | null;
  status?: UserStatus;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  updatedBy: string;
}

export interface UserQueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
