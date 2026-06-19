import { z } from 'zod';

const AADHAAR_REGEX = /^\d{12}$/;
const PAN_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;
const MOBILE_REGEX = /^\+?[1-9]\d{9,14}$/;

export const createUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  primaryMobile: z.string().regex(MOBILE_REGEX, 'Invalid mobile format (e.g., +919876543210)'),
  secondaryMobile: z.string().regex(MOBILE_REGEX, 'Invalid mobile format').optional().or(z.literal('')),
  aadhaar: z.string().regex(AADHAAR_REGEX, 'Aadhaar must be exactly 12 digits'),
  pan: z.string().regex(PAN_REGEX, 'PAN must be in format ABCDE1234F').toUpperCase(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(2, 'Place of birth must be at least 2 characters').max(255),
  currentAddress: z.string().min(5, 'Address must be at least 5 characters').max(1000),
  permanentAddress: z.string().min(5, 'Address must be at least 5 characters').max(1000),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateUserFormSchema = createUserFormSchema.partial().extend({
  updatedBy: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
