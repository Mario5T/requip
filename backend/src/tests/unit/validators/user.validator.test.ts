import {
  createUserSchema,
  updateUserSchema,
  queryUsersSchema,
  idParamSchema,
} from '../../../validators/user.validator';

describe('User Validators', () => {
  // ─── Create User Schema ──────────────────────────────────────
  describe('createUserSchema', () => {
    const validInput = {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      primaryMobile: '+919876543210',
      aadhaar: '123456789012',
      pan: 'ABCDE1234F',
      dateOfBirth: '1995-06-15',
      placeOfBirth: 'Mumbai',
      currentAddress: '123, MG Road, Mumbai, Maharashtra',
      permanentAddress: '456, Station Road, Pune, Maharashtra',
      createdBy: 'system',
    };

    it('should validate a correct input', () => {
      const result = createUserSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate input with optional fields', () => {
      const result = createUserSchema.safeParse({
        ...validInput,
        gender: 'MALE',
        secondaryMobile: '+919876543211',
        status: 'ACTIVE',
      });
      expect(result.success).toBe(true);
    });

    // Email validation
    it('should reject invalid email format', () => {
      const result = createUserSchema.safeParse({ ...validInput, email: 'invalid-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('email');
      }
    });

    it('should reject empty email', () => {
      const result = createUserSchema.safeParse({ ...validInput, email: '' });
      expect(result.success).toBe(false);
    });

    // Aadhaar validation
    it('should reject Aadhaar with less than 12 digits', () => {
      const result = createUserSchema.safeParse({ ...validInput, aadhaar: '12345678901' });
      expect(result.success).toBe(false);
    });

    it('should reject Aadhaar with more than 12 digits', () => {
      const result = createUserSchema.safeParse({ ...validInput, aadhaar: '1234567890123' });
      expect(result.success).toBe(false);
    });

    it('should reject Aadhaar with letters', () => {
      const result = createUserSchema.safeParse({ ...validInput, aadhaar: '12345678901a' });
      expect(result.success).toBe(false);
    });

    it('should accept valid 12-digit Aadhaar', () => {
      const result = createUserSchema.safeParse({ ...validInput, aadhaar: '999988887777' });
      expect(result.success).toBe(true);
    });

    // PAN validation
    it('should reject invalid PAN format', () => {
      const result = createUserSchema.safeParse({ ...validInput, pan: 'INVALID' });
      expect(result.success).toBe(false);
    });

    it('should reject PAN with lowercase letters', () => {
      const result = createUserSchema.safeParse({ ...validInput, pan: 'abcde1234f' });
      expect(result.success).toBe(false);
    });

    it('should accept valid PAN format', () => {
      const result = createUserSchema.safeParse({ ...validInput, pan: 'ZZZZZ9999Z' });
      expect(result.success).toBe(true);
    });

    // Mobile validation
    it('should reject invalid mobile number', () => {
      const result = createUserSchema.safeParse({ ...validInput, primaryMobile: '123' });
      expect(result.success).toBe(false);
    });

    it('should accept valid mobile with country code', () => {
      const result = createUserSchema.safeParse({ ...validInput, primaryMobile: '+919876543210' });
      expect(result.success).toBe(true);
    });

    // Name validation
    it('should reject name shorter than 2 characters', () => {
      const result = createUserSchema.safeParse({ ...validInput, name: 'A' });
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const result = createUserSchema.safeParse({ ...validInput, name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });

    // Date of birth validation
    it('should reject future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = createUserSchema.safeParse({
        ...validInput,
        dateOfBirth: futureDate.toISOString().split('T')[0],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const result = createUserSchema.safeParse({ ...validInput, dateOfBirth: 'not-a-date' });
      expect(result.success).toBe(false);
    });

    // Address validation
    it('should reject address shorter than 5 characters', () => {
      const result = createUserSchema.safeParse({ ...validInput, currentAddress: '123' });
      expect(result.success).toBe(false);
    });

    // Missing required fields
    it('should reject missing required fields', () => {
      const result = createUserSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Update User Schema ─────────────────────────────────────
  describe('updateUserSchema', () => {
    it('should validate partial update with updatedBy', () => {
      const result = updateUserSchema.safeParse({
        name: 'Updated Name',
        updatedBy: 'admin',
      });
      expect(result.success).toBe(true);
    });

    it('should reject update with only updatedBy (no actual changes)', () => {
      const result = updateUserSchema.safeParse({
        updatedBy: 'admin',
      });
      expect(result.success).toBe(false);
    });

    it('should reject update without updatedBy', () => {
      const result = updateUserSchema.safeParse({
        name: 'Updated Name',
      });
      expect(result.success).toBe(false);
    });
  });

  // ─── Query Users Schema ─────────────────────────────────────
  describe('queryUsersSchema', () => {
    it('should apply defaults when no params provided', () => {
      const result = queryUsersSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('should reject invalid sortBy field', () => {
      const result = queryUsersSchema.safeParse({ sortBy: 'invalidField' });
      expect(result.success).toBe(false);
    });

    it('should reject limit exceeding max', () => {
      const result = queryUsersSchema.safeParse({ limit: 200 });
      expect(result.success).toBe(false);
    });

    it('should coerce string numbers to integers', () => {
      const result = queryUsersSchema.safeParse({ page: '2', limit: '20' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });
  });

  // ─── ID Param Schema ────────────────────────────────────────
  describe('idParamSchema', () => {
    it('should accept valid UUID', () => {
      const result = idParamSchema.safeParse({ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = idParamSchema.safeParse({ id: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('should reject empty id', () => {
      const result = idParamSchema.safeParse({ id: '' });
      expect(result.success).toBe(false);
    });
  });
});
