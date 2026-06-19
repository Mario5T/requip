import { UserService } from '../../../services/user.service';
import { UserRepository } from '../../../repositories/user.repository';
import { ApiError } from '../../../utils/api-error';
import { ERROR_MESSAGES } from '../../../utils/constants';

// Mock the UserRepository
jest.mock('../../../repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    primaryMobile: '+919876543210',
    secondaryMobile: null,
    aadhaar: '123456789012',
    pan: 'ABCDE1234F',
    dateOfBirth: new Date('1995-06-15'),
    placeOfBirth: 'Mumbai',
    currentAddress: '123, MG Road, Mumbai',
    permanentAddress: '456, Station Road, Pune',
    gender: null,
    profilePhotoUrl: null,
    status: 'ACTIVE' as const,
    emailVerified: false,
    mobileVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    version: 1,
    createdBy: 'system',
    updatedBy: 'system',
  };

  const createUserInput = {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    primaryMobile: '+919876543210',
    aadhaar: '123456789012',
    pan: 'ABCDE1234F',
    dateOfBirth: '1995-06-15',
    placeOfBirth: 'Mumbai',
    currentAddress: '123, MG Road, Mumbai',
    permanentAddress: '456, Station Road, Pune',
    createdBy: 'system',
  };

  beforeEach(() => {
    mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepository);
    jest.clearAllMocks();
  });

  // ─── Create User ─────────────────────────────────────────────
  describe('createUser', () => {
    it('should create a user successfully when no duplicates exist', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByAadhaar.mockResolvedValue(null);
      mockRepository.findByPan.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(createUserInput);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('rahul@example.com');
      expect(mockRepository.findByAadhaar).toHaveBeenCalledWith('123456789012');
      expect(mockRepository.findByPan).toHaveBeenCalledWith('ABCDE1234F');
      expect(mockRepository.create).toHaveBeenCalledWith(createUserInput);
    });

    it('should throw 409 if email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.createUser(createUserInput)).rejects.toThrow(ApiError);
      await expect(userService.createUser(createUserInput)).rejects.toMatchObject({
        statusCode: 409,
        message: ERROR_MESSAGES.EMAIL_EXISTS,
      });
    });

    it('should throw 409 if Aadhaar already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByAadhaar.mockResolvedValue(mockUser);

      await expect(userService.createUser(createUserInput)).rejects.toThrow(ApiError);
      await expect(userService.createUser(createUserInput)).rejects.toMatchObject({
        statusCode: 409,
        message: ERROR_MESSAGES.AADHAAR_EXISTS,
      });
    });

    it('should throw 409 if PAN already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.findByAadhaar.mockResolvedValue(null);
      mockRepository.findByPan.mockResolvedValue(mockUser);

      await expect(userService.createUser(createUserInput)).rejects.toThrow(ApiError);
      await expect(userService.createUser(createUserInput)).rejects.toMatchObject({
        statusCode: 409,
        message: ERROR_MESSAGES.PAN_EXISTS,
      });
    });
  });

  // ─── Get User By ID ──────────────────────────────────────────
  describe('getUserById', () => {
    it('should return user when found', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw 404 when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById('nonexistent-id')).rejects.toThrow(ApiError);
      await expect(userService.getUserById('nonexistent-id')).rejects.toMatchObject({
        statusCode: 404,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    });
  });

  // ─── Get Users ───────────────────────────────────────────────
  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const paginatedResult = {
        data: [mockUser],
        pagination: {
          page: 1,
          limit: 10,
          totalRecords: 1,
          totalPages: 1,
        },
      };
      mockRepository.findAll.mockResolvedValue(paginatedResult);

      const params = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' as const };
      const result = await userService.getUsers(params);

      expect(result).toEqual(paginatedResult);
      expect(result.pagination.totalRecords).toBe(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith(params);
    });

    it('should return empty list when no users exist', async () => {
      const emptyResult = {
        data: [],
        pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 0 },
      };
      mockRepository.findAll.mockResolvedValue(emptyResult);

      const result = await userService.getUsers({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.totalRecords).toBe(0);
    });
  });

  // ─── Update User ─────────────────────────────────────────────
  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, name: 'Rahul Kumar', version: 2 };
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(mockUser.id, {
        name: 'Rahul Kumar',
        updatedBy: 'admin',
      });

      expect(result.name).toBe('Rahul Kumar');
      expect(result.version).toBe(2);
    });

    it('should throw 404 when updating non-existent user', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        userService.updateUser('nonexistent-id', { name: 'Test', updatedBy: 'admin' }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should throw 409 when updating email to one that already exists', async () => {
      const otherUser = { ...mockUser, id: 'other-id', email: 'other@example.com' };
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.findByEmail.mockResolvedValue(otherUser);

      await expect(
        userService.updateUser(mockUser.id, {
          email: 'other@example.com',
          updatedBy: 'admin',
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: ERROR_MESSAGES.EMAIL_EXISTS,
      });
    });

    it('should allow updating with the same email (no conflict)', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(mockUser);

      const result = await userService.updateUser(mockUser.id, {
        email: 'rahul@example.com',
        updatedBy: 'admin',
      });

      expect(result).toBeDefined();
      // findByEmail should not be called when email doesn't change
    });
  });

  // ─── Delete User ─────────────────────────────────────────────
  describe('deleteUser', () => {
    it('should soft delete user successfully', async () => {
      const deletedUser = { ...mockUser, isDeleted: true, deletedAt: new Date() };
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.softDelete.mockResolvedValue(deletedUser);

      const result = await userService.deleteUser(mockUser.id);

      expect(result.isDeleted).toBe(true);
      expect(result.deletedAt).toBeDefined();
      expect(mockRepository.softDelete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw 404 when deleting non-existent user', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.deleteUser('nonexistent-id')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should throw 400 when user is already deleted', async () => {
      const alreadyDeleted = { ...mockUser, isDeleted: true, deletedAt: new Date() };
      mockRepository.findById.mockResolvedValue(alreadyDeleted);

      await expect(userService.deleteUser(mockUser.id)).rejects.toMatchObject({
        statusCode: 400,
        message: ERROR_MESSAGES.USER_ALREADY_DELETED,
      });
    });
  });
});
