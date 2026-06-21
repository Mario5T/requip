# Requip — User Management System

A production-ready, full-stack User Management System built with **Express.js**, **TypeScript**, **Prisma**, **MySQL**, and **React**. Features CRUD operations, pagination, search, soft-delete, comprehensive validation, Swagger documentation, Docker support, and 80%+ test coverage.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                      │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ React    │  │ React Hook   │  │ React Query + Axios    │  │
│  │ Router   │  │ Form + Zod   │  │ (Data Fetching)        │  │
│  └──────────┘  └──────────────┘  └────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP (REST)
┌──────────────────────────▼───────────────────────────────────┐
│                  Express.js Backend (TypeScript)              │
│                                                              │
│  ┌─────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │ Helmet  │ │ CORS       │ │ Rate Limit │ │ Winston Log │  │
│  └─────────┘ └────────────┘ └────────────┘ └─────────────┘  │
│                                                              │
│  Routes → Validators(Zod) → Controllers → Services → Repos  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Prisma ORM                                │  │
│  └────────────────────────┬───────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   MySQL 8   │
                    └─────────────┘
```

**Design Principles:**
- **Clean Architecture** — Strict layer separation (Controller → Service → Repository)
- **SOLID** — Single responsibility per class, dependency injection via constructor
- **DRY** — Shared validation schemas, centralized constants, reusable components

---

## Folder Structure

```
requip/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, env, logger configuration
│   │   ├── controllers/     # HTTP request/response handling
│   │   ├── docs/            # Swagger/OpenAPI specification
│   │   ├── middleware/      # Error handler, validation, logging
│   │   ├── models/          # TypeScript interfaces
│   │   ├── repositories/    # Database operations (Prisma)
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Business logic
│   │   ├── tests/           # Unit & integration tests
│   │   ├── utils/           # ApiError, response helpers, constants
│   │   └── validators/      # Zod validation schemas
│   ├── prisma/              # Schema & migrations
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API layer
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # React Query hooks
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Zod validation schemas
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **MySQL** 8.0+ (or use Docker)
- **npm** 9+

### Option 1: Docker (Recommended)

```bash
# Start MySQL + Backend with one command
docker-compose up --build

# Backend: http://localhost:3000
# API Docs: http://localhost:3000/api-docs
```

### Option 2: Local Development

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 3. Access the Application

| Service          | URL                              |
|------------------|----------------------------------|
| Frontend         | http://localhost:5173             |
| Backend API      | http://localhost:3000/api/v1      |
| Swagger UI       | http://localhost:3000/api-docs    |
| Health Check     | http://localhost:3000/health      |

---

## API Documentation

### Endpoints

| Method   | Endpoint            | Description                    |
|----------|---------------------|--------------------------------|
| `POST`   | `/api/v1/users`     | Create a new user              |
| `GET`    | `/api/v1/users`     | List users (paginated)         |
| `GET`    | `/api/v1/users/:id` | Get user by ID                 |
| `PUT`    | `/api/v1/users/:id` | Update user (partial)          |
| `DELETE` | `/api/v1/users/:id` | Soft delete user               |

### Query Parameters (GET /api/v1/users)

| Param      | Type    | Default     | Description                       |
|------------|---------|-------------|-----------------------------------|
| `page`     | number  | 1           | Page number                       |
| `limit`    | number  | 10          | Records per page (max 100)        |
| `sortBy`   | string  | createdAt   | name, email, createdAt, updatedAt |
| `sortOrder`| string  | desc        | asc or desc                       |
| `search`   | string  | —           | Search by name, email, mobile     |

### Response Format

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecords": 45,
    "totalPages": 5
  }
}
```

Full interactive docs available at **http://localhost:3000/api-docs**

---

## Design Decisions

1. **Clean Architecture** — Separates concerns into layers (Routes → Controllers → Services → Repositories) for testability and maintainability.

2. **Prisma over raw SQL** — Type-safe queries, auto-generated migrations, and excellent TypeScript integration.

3. **Zod for validation** — Runtime type checking with TypeScript inference. Shared validation logic between frontend and backend.

4. **Soft Delete** — Records are never permanently deleted. `isDeleted` flag + `deletedAt` timestamp for audit compliance.

5. **Version Field** — Optimistic concurrency control. Version increments on every update.

6. **React Query** — Automatic caching, background refetching, and invalidation. Superior to manual state management for server data.

7. **URL-based state** — Pagination, search, and sort state stored in URL params for shareability and browser history support.

---

## Security Measures

| Measure              | Implementation                                        |
|----------------------|-------------------------------------------------------|
| **Helmet**           | Sets security HTTP headers (CSP, HSTS, etc.)          |
| **CORS**             | Configured to allow only the frontend origin           |
| **Rate Limiting**    | 100 requests per 15-minute window per IP              |
| **Input Validation** | Zod schemas validate all inputs before processing      |
| **SQL Injection**    | Prisma uses parameterized queries by default           |
| **Error Sanitization** | Production errors don't expose stack traces           |
| **Non-root Docker**  | Application runs as non-root user in container         |

---

## Performance Optimizations

1. **Database Indexes** — Unique indexes on email, aadhaar, pan; composite index on isDeleted for soft-delete filtering.
2. **Parallel Queries** — `Promise.all` for count + data fetch in pagination.
3. **Lean Queries** — Prisma `findMany` with `take`/`skip` instead of loading all records.
4. **React Query Caching** — 30-second stale time reduces redundant API calls.
5. **Placeholder Data** — Previous page data shown during loading for seamless pagination.
6. **Multi-stage Docker** — Final image contains only production dependencies.

---

## Testing Instructions

```bash
cd backend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Tests cover:
# - Service layer (create, update, get, delete users)
# - Validator schemas (email, aadhaar, pan, mobile, query params)
# - Controller integration (HTTP endpoints via Supertest)
```

**Coverage Target:** >=80% lines, functions, statements

---

## Future Improvements

- [ ] JWT authentication with role-based access control
- [ ] Redis caching for frequently accessed user data
- [ ] File upload for profile photos (S3/MinIO integration)
- [ ] Email/SMS verification workflows
- [ ] Audit log table for tracking all changes
- [ ] Bulk operations (import/export CSV)
- [ ] WebSocket notifications for real-time updates
- [ ] API key management for third-party integrations
- [ ] Full-text search with Elasticsearch
- [ ] Kubernetes deployment manifests
