import request from 'supertest';
import app from '../../app';

// Mock Prisma client
jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    $on: jest.fn(),
    $disconnect: jest.fn(),
  },
  disconnectDatabase: jest.fn(),
}));

// Import after mocking
import { prisma } from '../../config/database';

const mockPrismaUser = prisma.user as unknown as {
  create: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  count: jest.Mock;
  update: jest.Mock;
};

describe('User Controller (Integration Tests)', () => {
  const validCreateBody = {
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

  const mockDbUser = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    ...validCreateBody,
    secondaryMobile: null,
    dateOfBirth: new Date('1995-06-15'),
    gender: null,
    profilePhotoUrl: null,
    status: 'ACTIVE',
    emailVerified: false,
    mobileVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
    version: 1,
    updatedBy: 'system',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── POST /api/v1/users ──────────────────────────────────────
  describe('POST /api/v1/users', () => {
    it('should create a user and return 201', async () => {
      // No duplicates found
      mockPrismaUser.findFirst.mockResolvedValue(null);
      mockPrismaUser.create.mockResolvedValue(mockDbUser);

      const res = await request(app).post('/api/v1/users').send(validCreateBody);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe('rahul@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ ...validCreateBody, email: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 for invalid Aadhaar', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ ...validCreateBody, aadhaar: '12345' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid PAN', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ ...validCreateBody, pan: 'INVALID' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app).post('/api/v1/users').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 409 for duplicate email', async () => {
      // First findFirst call (findByEmail) returns existing user
      mockPrismaUser.findFirst.mockResolvedValueOnce(mockDbUser);

      const res = await request(app).post('/api/v1/users').send(validCreateBody);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET /api/v1/users ───────────────────────────────────────
  describe('GET /api/v1/users', () => {
    it('should return paginated users', async () => {
      mockPrismaUser.count.mockResolvedValue(1);
      mockPrismaUser.findMany.mockResolvedValue([mockDbUser]);

      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
    });

    it('should support search parameter', async () => {
      mockPrismaUser.count.mockResolvedValue(0);
      mockPrismaUser.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/v1/users?search=rahul');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('should support pagination parameters', async () => {
      mockPrismaUser.count.mockResolvedValue(50);
      mockPrismaUser.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/v1/users?page=2&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('should reject invalid sortBy field', async () => {
      const res = await request(app).get('/api/v1/users?sortBy=invalidField');

      expect(res.status).toBe(400);
    });
  });

  // ─── GET /api/v1/users/:id ───────────────────────────────────
  describe('GET /api/v1/users/:id', () => {
    it('should return a user by ID', async () => {
      mockPrismaUser.findFirst.mockResolvedValue(mockDbUser);

      const res = await request(app).get(
        `/api/v1/users/${mockDbUser.id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockDbUser.id);
    });

    it('should return 404 for non-existent user', async () => {
      mockPrismaUser.findFirst.mockResolvedValue(null);

      const res = await request(app).get(
        '/api/v1/users/a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid UUID format', async () => {
      const res = await request(app).get('/api/v1/users/invalid-id');

      expect(res.status).toBe(400);
    });
  });

  // ─── PUT /api/v1/users/:id ───────────────────────────────────
  describe('PUT /api/v1/users/:id', () => {
    it('should update a user successfully', async () => {
      const updatedUser = { ...mockDbUser, name: 'Rahul Kumar', version: 2 };
      mockPrismaUser.findFirst.mockResolvedValue(mockDbUser);
      mockPrismaUser.update.mockResolvedValue(updatedUser);

      const res = await request(app)
        .put(`/api/v1/users/${mockDbUser.id}`)
        .send({ name: 'Rahul Kumar', updatedBy: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Rahul Kumar');
    });

    it('should return 400 when no fields to update', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${mockDbUser.id}`)
        .send({ updatedBy: 'admin' });

      expect(res.status).toBe(400);
    });
  });

  // ─── DELETE /api/v1/users/:id ────────────────────────────────
  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete a user', async () => {
      const deletedUser = { ...mockDbUser, isDeleted: true, deletedAt: new Date() };
      mockPrismaUser.findFirst.mockResolvedValue(mockDbUser);
      mockPrismaUser.update.mockResolvedValue(deletedUser);

      const res = await request(app).delete(
        `/api/v1/users/${mockDbUser.id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      mockPrismaUser.findFirst.mockResolvedValue(null);

      const res = await request(app).delete(
        '/api/v1/users/a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      );

      expect(res.status).toBe(404);
    });
  });

  // ─── Health Check & 404 ──────────────────────────────────────
  describe('General', () => {
    it('should return 200 on health check', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/unknown');
      expect(res.status).toBe(404);
    });
  });
});
