import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';
import { CreateUserInput, UpdateUserInput, UserQueryParams, PaginatedResult } from '../models/user.model';

/**
 * User Repository
 * Handles all database operations for the User entity.
 * All queries automatically exclude soft-deleted records unless specified.
 */
export class UserRepository {
  /**
   * Create a new user record.
   */
  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        primaryMobile: data.primaryMobile,
        secondaryMobile: data.secondaryMobile,
        aadhaar: data.aadhaar,
        pan: data.pan,
        dateOfBirth: new Date(data.dateOfBirth),
        placeOfBirth: data.placeOfBirth,
        currentAddress: data.currentAddress,
        permanentAddress: data.permanentAddress,
        gender: data.gender,
        profilePhotoUrl: data.profilePhotoUrl,
        status: data.status ?? 'ACTIVE',
        createdBy: data.createdBy,
        updatedBy: data.updatedBy ?? data.createdBy,
      },
    });
  }

  /**
   * Find a user by ID (excludes soft-deleted by default).
   */
  async findById(id: string, includeDeleted = false): Promise<User | null> {
    const where: Prisma.UserWhereInput = { id };
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    return prisma.user.findFirst({ where });
  }

  /**
   * Find a user by email (excludes soft-deleted).
   */
  async findByEmail(email: string, excludeId?: string): Promise<User | null> {
    const where: Prisma.UserWhereInput = { email, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return prisma.user.findFirst({ where });
  }

  /**
   * Find a user by Aadhaar (excludes soft-deleted).
   */
  async findByAadhaar(aadhaar: string, excludeId?: string): Promise<User | null> {
    const where: Prisma.UserWhereInput = { aadhaar, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return prisma.user.findFirst({ where });
  }

  /**
   * Find a user by PAN (excludes soft-deleted).
   */
  async findByPan(pan: string, excludeId?: string): Promise<User | null> {
    const where: Prisma.UserWhereInput = { pan, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return prisma.user.findFirst({ where });
  }

  /**
   * Find all users with pagination, sorting, and search.
   * Automatically excludes soft-deleted records.
   */
  async findAll(params: UserQueryParams): Promise<PaginatedResult<User>> {
    const { page, limit, sortBy, sortOrder, search } = params;
    const skip = (page - 1) * limit;

    // Build search condition
    const where: Prisma.UserWhereInput = { isDeleted: false };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { primaryMobile: { contains: search } },
      ];
    }

    // Execute count and find in parallel for performance
    const [totalRecords, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  /**
   * Update a user by ID.
   * Increments the version field on each update.
   */
  async update(id: string, data: UpdateUserInput, currentVersion: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedBy, ...updateFields } = data;

    const updateData: Prisma.UserUpdateInput = {
      ...updateFields,
      updatedBy: data.updatedBy,
      version: currentVersion + 1,
    };

    // Convert dateOfBirth string to Date if provided
    if (updateFields.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateFields.dateOfBirth);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Soft delete a user by ID.
   * Sets isDeleted=true and populates deletedAt.
   */
  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
