import { z } from 'zod';
import { VALIDATION_PATTERNS, PAGINATION, SORT_ORDER, SORTABLE_FIELDS } from '../utils/constants';

/**
 * Zod Validation Schemas for User operations.
 * All validation rules are centralized here.
 */

// --- Shared field schemas ---

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim();

const emailSchema = z.string().email('Invalid email format').max(255).trim().toLowerCase();

const primaryMobileSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.MOBILE, 'Invalid mobile number format (e.g., +919876543210)')
  .trim();

const secondaryMobileSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.MOBILE, 'Invalid mobile number format')
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((val) => val || undefined);

const aadhaarSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.AADHAAR, 'Aadhaar must be exactly 12 digits')
  .trim();

const panSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.PAN, 'PAN must be in format ABCDE1234F')
  .trim()
  .toUpperCase();

const dateOfBirthSchema = z
  .string()
  .refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    },
    { message: 'Date of birth must be a valid date in the past' },
  );

const placeOfBirthSchema = z
  .string()
  .min(2, 'Place of birth must be at least 2 characters')
  .max(255, 'Place of birth must not exceed 255 characters')
  .trim();

const addressSchema = z
  .string()
  .min(5, 'Address must be at least 5 characters')
  .max(1000, 'Address must not exceed 1000 characters')
  .trim();

const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']).optional();

const statusSchema = z.enum(['ACTIVE', 'INACTIVE']).optional();

// --- Create User Schema ---

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  primaryMobile: primaryMobileSchema,
  secondaryMobile: secondaryMobileSchema,
  aadhaar: aadhaarSchema,
  pan: panSchema,
  dateOfBirth: dateOfBirthSchema,
  placeOfBirth: placeOfBirthSchema,
  currentAddress: addressSchema,
  permanentAddress: addressSchema,
  gender: genderSchema,
  profilePhotoUrl: z.string().url('Invalid URL format').optional(),
  status: statusSchema,
  createdBy: z.string().min(1, 'createdBy is required').max(100).trim(),
});

// --- Update User Schema (all fields optional except updatedBy) ---

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    primaryMobile: primaryMobileSchema.optional(),
    secondaryMobile: secondaryMobileSchema.nullable(),
    aadhaar: aadhaarSchema.optional(),
    pan: panSchema.optional(),
    dateOfBirth: dateOfBirthSchema.optional(),
    placeOfBirth: placeOfBirthSchema.optional(),
    currentAddress: addressSchema.optional(),
    permanentAddress: addressSchema.optional(),
    gender: genderSchema.nullable(),
    profilePhotoUrl: z.string().url('Invalid URL format').optional().nullable(),
    status: statusSchema,
    emailVerified: z.boolean().optional(),
    mobileVerified: z.boolean().optional(),
    updatedBy: z.string().min(1, 'updatedBy is required').max(100).trim(),
  })
  .refine(
    (data) => {
      // Ensure at least one field besides updatedBy is provided
      const { updatedBy: _, ...rest } = data;
      return Object.values(rest).some((v) => v !== undefined);
    },
    { message: 'At least one field must be provided for update' },
  );

// --- Query Params Schema ---

export const queryUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(PAGINATION.MAX_LIMIT, `Limit cannot exceed ${PAGINATION.MAX_LIMIT}`)
    .default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z
    .string()
    .refine((val) => (SORTABLE_FIELDS as readonly string[]).includes(val), {
      message: `sortBy must be one of: ${SORTABLE_FIELDS.join(', ')}`,
    })
    .default('createdAt'),
  sortOrder: z.enum([SORT_ORDER.ASC, SORT_ORDER.DESC]).default(SORT_ORDER.DESC),
  search: z.string().trim().optional(),
});

// --- ID Param Schema ---

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

// Export inferred types
export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type QueryUsersSchemaType = z.infer<typeof queryUsersSchema>;
export type IdParamSchemaType = z.infer<typeof idParamSchema>;
