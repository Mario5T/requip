import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI Configuration
 * Generates complete API documentation with schemas, examples, and error responses.
 */

const swaggerDefinition: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Requip — User Management API',
      version: '1.0.0',
      description:
        'A production-ready User Management System with CRUD operations, pagination, search, soft-delete, and comprehensive validation.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            name: { type: 'string', example: 'Rahul Sharma' },
            email: { type: 'string', format: 'email', example: 'rahul@example.com' },
            primaryMobile: { type: 'string', example: '+919876543210' },
            secondaryMobile: { type: 'string', nullable: true, example: '+919876543211' },
            aadhaar: { type: 'string', example: '123456789012' },
            pan: { type: 'string', example: 'ABCDE1234F' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-06-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123, MG Road, Mumbai, Maharashtra' },
            permanentAddress: { type: 'string', example: '456, Station Road, Pune, Maharashtra' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true, example: 'MALE' },
            profilePhotoUrl: { type: 'string', nullable: true, example: 'https://example.com/photo.jpg' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
            emailVerified: { type: 'boolean', example: false },
            mobileVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
            isDeleted: { type: 'boolean', example: false },
            version: { type: 'integer', example: 1 },
            createdBy: { type: 'string', example: 'system' },
            updatedBy: { type: 'string', example: 'system' },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: [
            'name', 'email', 'primaryMobile', 'aadhaar', 'pan',
            'dateOfBirth', 'placeOfBirth', 'currentAddress', 'permanentAddress', 'createdBy',
          ],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Rahul Sharma' },
            email: { type: 'string', format: 'email', example: 'rahul@example.com' },
            primaryMobile: { type: 'string', example: '+919876543210' },
            secondaryMobile: { type: 'string', example: '+919876543211' },
            aadhaar: { type: 'string', pattern: '^\\d{12}$', example: '123456789012' },
            pan: { type: 'string', pattern: '^[A-Z]{5}\\d{4}[A-Z]$', example: 'ABCDE1234F' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-06-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123, MG Road, Mumbai, Maharashtra' },
            permanentAddress: { type: 'string', example: '456, Station Road, Pune, Maharashtra' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
            profilePhotoUrl: { type: 'string', format: 'uri', example: 'https://example.com/photo.jpg' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
            createdBy: { type: 'string', example: 'system' },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['updatedBy'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Rahul Kumar Sharma' },
            email: { type: 'string', format: 'email', example: 'rahul.new@example.com' },
            primaryMobile: { type: 'string', example: '+919876543210' },
            secondaryMobile: { type: 'string', nullable: true, example: '+919876543211' },
            aadhaar: { type: 'string', pattern: '^\\d{12}$', example: '123456789012' },
            pan: { type: 'string', pattern: '^[A-Z]{5}\\d{4}[A-Z]$', example: 'ABCDE1234F' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-06-15' },
            placeOfBirth: { type: 'string', example: 'Mumbai' },
            currentAddress: { type: 'string', example: '123, MG Road, Mumbai' },
            permanentAddress: { type: 'string', example: '456, Station Road, Pune' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true },
            profilePhotoUrl: { type: 'string', format: 'uri', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            emailVerified: { type: 'boolean' },
            mobileVerified: { type: 'boolean' },
            updatedBy: { type: 'string', example: 'admin' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                totalRecords: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      '/api/v1/users': {
        post: {
          tags: ['Users'],
          summary: 'Create a new user',
          description: 'Creates a new user with validation for email, Aadhaar, PAN, and mobile formats.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserRequest' },
              },
            },
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/User' } },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            '409': {
              description: 'Conflict — duplicate email, Aadhaar, or PAN',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
        get: {
          tags: ['Users'],
          summary: 'Get all users (paginated)',
          description: 'Retrieves users with pagination, sorting, and search. Soft-deleted users are excluded.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10, maximum: 100 },
              description: 'Number of records per page',
            },
            {
              name: 'sortBy',
              in: 'query',
              schema: { type: 'string', enum: ['name', 'email', 'createdAt', 'updatedAt'], default: 'createdAt' },
              description: 'Field to sort by',
            },
            {
              name: 'sortOrder',
              in: 'query',
              schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
              description: 'Sort direction',
            },
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search by name, email, or mobile',
            },
          ],
          responses: {
            '200': {
              description: 'Users retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          description: 'Retrieves a single user by UUID. Returns 404 if user not found or deleted.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'User UUID',
            },
          ],
          responses: {
            '200': {
              description: 'User retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/User' } },
                      },
                    ],
                  },
                },
              },
            },
            '404': {
              description: 'User not found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update user by ID',
          description: 'Supports partial updates. At least one field (besides updatedBy) must be provided.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'User UUID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateUserRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/User' } },
                      },
                    ],
                  },
                },
              },
            },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '409': { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user by ID (soft delete)',
          description: 'Performs a soft delete: sets isDeleted=true and populates deletedAt. The record is not permanently removed.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'User UUID',
            },
          ],
          responses: {
            '200': {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
            '404': { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerDefinition);
