export interface User {
  id: string;
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile: string | null;
  aadhaar: string;
  pan: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  profilePhotoUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  emailVerified: boolean;
  mobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  version: number;
  createdBy: string;
  updatedBy: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile?: string;
  aadhaar: string;
  pan: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  profilePhotoUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
}

export interface UpdateUserPayload {
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
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  profilePhotoUrl?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
  updatedBy: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
