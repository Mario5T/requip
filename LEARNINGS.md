# Assignment Learnings

## 1. Challenges Faced

### Database Schema Design
Designing a schema that balances normalization with practical query performance was challenging. The `users` table has several unique constraints (email, aadhaar, pan) that require careful handling during both creation and updates — especially when checking for duplicates while excluding the current record during updates.

### Soft Delete Implementation
Implementing soft delete requires discipline across the entire codebase. Every query must include `isDeleted: false` to prevent deleted records from appearing. The repository layer encapsulates this logic, but it's easy to miss in ad-hoc queries. A Prisma middleware could automate this, but explicit filtering was chosen for transparency.

### Validation Consistency
Maintaining identical validation rules between frontend (React Hook Form + Zod) and backend (Zod middleware) requires careful coordination. The regex patterns for Aadhaar (`/^\d{12}$/`), PAN (`/^[A-Z]{5}\d{4}[A-Z]$/`), and mobile (`/^\+?[1-9]\d{9,14}$/`) must match exactly on both sides.

### Error Handling Across Layers
Building a consistent error pipeline from Prisma → Repository → Service → Controller → Error Middleware required careful design. Each layer must either handle or propagate errors appropriately without leaking implementation details.

---

## 2. Why Prisma Was Chosen

- **Type Safety**: Auto-generated TypeScript types from the schema eliminate runtime type mismatches between application code and database.
- **Migration Management**: Prisma Migrate tracks schema changes declaratively, making database evolution reproducible.
- **Developer Experience**: Prisma Studio provides a visual database browser. The query API is intuitive and chainable.
- **Performance**: Prisma uses prepared statements and connection pooling by default.
- **Trade-off**: Prisma adds a build step (generate) and has a larger runtime footprint than raw SQL. For this project, the productivity gains far outweigh the overhead.

---

## 3. Why Layered Architecture Was Chosen

### Separation of Concerns
- **Controllers** handle HTTP concerns (request parsing, status codes, response formatting)
- **Services** contain business rules (duplicate checking, version management)
- **Repositories** handle database operations (Prisma queries, pagination logic)

### Testability
Each layer can be tested in isolation:
- Services are tested with mocked repositories
- Controllers are tested with Supertest (integration)
- Validators are tested directly against Zod schemas

### Maintainability
Changing the database (e.g., from MySQL to PostgreSQL) only affects the repository layer. Changing the web framework (e.g., from Express to Fastify) only affects controllers and routes.

---

## 4. Validation Strategy

**Dual-layer validation** ensures data integrity:

1. **Frontend**: React Hook Form with Zod resolver provides instant feedback as users type.
2. **Backend**: Zod middleware validates every request before it reaches the controller. This protects against API consumers who bypass the frontend.

**Key patterns:**
- Shared regex patterns in constants files
- Custom refinements for business rules (e.g., DOB must be in the past)
- Transform functions (e.g., email → lowercase, PAN → uppercase)
- Coerce functions for query params (string "10" → number 10)

---

## 5. Security Considerations

| Risk                    | Mitigation                                                    |
|-------------------------|---------------------------------------------------------------|
| SQL Injection           | Prisma uses parameterized queries — never raw string concat   |
| XSS                     | Helmet sets Content-Security-Policy headers                   |
| CSRF                    | CORS restricts origins; credentials require explicit config   |
| Rate Limiting           | express-rate-limit prevents brute-force attacks               |
| Data Exposure           | Production errors return generic messages, not stack traces    |
| PII Protection          | Aadhaar displayed with spaces (UI only) — not masked at API level yet |

**Future:** JWT authentication, field-level encryption for Aadhaar/PAN, audit logging.

---

## 6. Scaling Considerations

### Horizontal Scaling
- The API is stateless — any instance can handle any request
- Database connection pooling via Prisma prevents exhaustion under load
- Docker Compose can be extended to multiple backend replicas behind a load balancer

### Vertical Scaling
- Database indexes on frequently queried fields (email, name, mobile)
- Pagination with skip/take prevents full-table scans
- Parallel count + data queries reduce pagination response time

### Beyond This Project
- **Read replicas** for GET endpoints
- **Redis caching** for hot user lookups
- **Message queues** for async operations (email verification, notifications)
- **Database sharding** by region for global deployment

---

## 7. Performance Improvements

1. **Indexed queries**: All unique fields and search fields are indexed
2. **Parallel database calls**: `Promise.all([count, findMany])` for paginated endpoints
3. **Client-side caching**: React Query's 30s stale time reduces API calls
4. **Placeholder data**: Shows previous page data during navigation for perceived speed
5. **Multi-stage Docker build**: Production image contains only compiled JS + production deps
6. **Lean responses**: Only necessary fields are queried (no `SELECT *` equivalent)

---

## 8. Trade-offs Considered

| Decision                   | Chosen                          | Alternative                      | Reason                              |
|----------------------------|---------------------------------|----------------------------------|--------------------------------------|
| ORM                        | Prisma                          | TypeORM, Knex, raw SQL          | Type safety, DX, migration mgmt     |
| Validation                 | Zod                             | Joi, class-validator             | TS-first, works on both client/server|
| State Management           | React Query                     | Redux, Zustand                   | Built for server state, less boilerplate |
| CSS                        | Vanilla CSS                     | Tailwind, Styled Components      | Full control, no build dependency    |
| Soft Delete                | Boolean flag + timestamp        | Separate archive table           | Simpler queries, same table indexes  |
| Auth                       | Not implemented                 | JWT + RBAC                       | Out of scope for assignment          |
| Logging                    | Winston (file + console)        | Pino, Bunyan                     | Most popular, flexible transports    |

---

## 9. What Would Be Improved With More Time

1. **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Viewer, Editor).
2. **Field-level Encryption**: Encrypt Aadhaar and PAN at rest using AES-256.
3. **Comprehensive E2E Tests**: Playwright or Cypress tests for the full user flow.
4. **CI/CD Pipeline**: GitHub Actions for lint → test → build → deploy.
5. **API Versioning Strategy**: Content negotiation or URL versioning with deprecation headers.
6. **Observability**: Structured logging with correlation IDs, Prometheus metrics, distributed tracing.
7. **Database Migrations**: Production-ready migration strategy with rollback support.
8. **Input Sanitization**: HTML entity encoding for text fields to prevent stored XSS.
9. **Internationalization**: Multi-language support for validation messages and UI text.
10. **Accessibility**: WCAG 2.1 AA compliance for the React frontend.
