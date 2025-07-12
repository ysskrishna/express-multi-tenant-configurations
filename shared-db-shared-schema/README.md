# shared-db-shared-schema

A multi-tenant API built with Node.js, Express, PostgreSQL, and Prisma, using a shared schema model. All tenant data resides in common database tables (public schema), with logical isolation using a tenantId field. This architecture simplifies management while supporting multi-tenant functionality.

## Features
- **Multi-tenancy with shared schema**:  All data is stored in common tables and isolated logically via tenantId.
- **Superadmin management**: Create and list tenants, and create users for any tenant.
- **Tenant authentication**: JWT-based login for tenant users.
- **Contact management**: Authenticated users can manage their contacts.
- **Prisma ORM**: Uses a single Prisma schema for all data.

## Folder Structure
```
shared-db-shared-schema/
├── index.js                # Main Express app
├── config.js               # Environment/config variables
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Shared schema (tenants, users, contacts)
├── routes/                 # API route handlers
│   ├── superadmin.js       # Superadmin endpoints
│   ├── tenant.js           # Tenant login endpoints
│   └── contacts.js         # Contact CRUD endpoints
├── middleware/             # Auth and validation middleware
├── schemas/                # Joi validation schemas
├── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 13+

### 1. Clone and Install
```bash
cd shared-db-shared-schema
npm install
```

### 2. Environment Variables
Create a `.env` file in this directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
SUPER_ADMIN_TOKEN=your_superadmin_token
PORT=3000
```
- `DATABASE_URL` should point to your Postgres instance.
- `SUPER_ADMIN_TOKEN` is used for superadmin authentication.

### 3. Database Setup
- Run initial migration for the shared schema:
  ```bash
  npm run prisma:migrate
  ```
- Generate Prisma client:
  ```bash
  npm run prisma:generate
  ```

### 4. Start the Server
```bash
npm start
```

## API Overview

### Superadmin Endpoints (`/superadmin`)
- `GET /superadmin/tenants` — List all tenants (requires `SUPER_ADMIN_TOKEN` in `x-super-admin-token` header)
- `POST /superadmin/tenants` — Create a new tenant `{ name }`
- `POST /superadmin/tenants/:tenantId/users` — Create a user in a tenant `{ email, name, password }`

### Tenant Endpoints (`/tenant`)
- `POST /tenant/login` — Authenticate a tenant user `{ email, password, tenant }`
  - Returns a JWT token

### Contacts Endpoints (`/contacts`)
- `GET /contacts` — List contacts for the authenticated user (requires tenant JWT)
- `POST /contacts` — Create a contact `{ name, email }` (requires tenant JWT)

## Multi-Tenancy Approach
- A single shared schema (public) is used for all tenants.
- Tables like User and Contact include a tenantId to logically separate data.
- The Tenant table tracks all tenant entries.
- No database-level partitioning or multiple schemas — all tenants share the same physical tables.

## Development & Testing
- See `prisma/` for schema definitions and migrations.
- See `routes/` for API logic.

## Scripts
- `npm start` — Start the server
- `npm run prisma:migrate` — Run migrations for the shared schema
- `npm run prisma:generate` — Generate Prisma client