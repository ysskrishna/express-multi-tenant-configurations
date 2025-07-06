# shared-db-seperate-schema

A Node.js/Express multi-tenant API using PostgreSQL and Prisma, where each tenant has a separate schema in a shared database. This approach provides strong data isolation while sharing infrastructure.

## Features
- **Multi-tenancy with separate schemas**: Each tenant's data is isolated in its own PostgreSQL schema.
- **Superadmin management**: Create and list tenants, and create users for any tenant.
- **Tenant authentication**: JWT-based login for tenant users.
- **Contact management**: Authenticated users can manage their contacts.
- **Prisma ORM**: Uses separate Prisma schemas for public (tenants) and tenant data.

## Folder Structure
```
shared-db-seperate-schema/
├── index.js                # Main Express app
├── config.js               # Environment/config variables
├── prisma/                 # Prisma schemas and migrations
│   ├── schema.prisma       # Public schema (tenants)
│   └── tenant_schema.prisma# Tenant schema (users, contacts)
├── routes/                 # API route handlers
│   ├── superadmin.js       # Superadmin endpoints
│   ├── tenant.js           # Tenant login endpoints
│   └── contacts.js         # Contact CRUD endpoints
├── middleware/             # Auth, validation, and schema middleware
├── prismaClientFactory.js  # Dynamic Prisma client per schema
├── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 13+
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) (optional, for local dev)

### 1. Clone and Install
```bash
cd shared-db-seperate-schema
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
- `DATABASE_URL` should point to your Postgres instance (without a `schema=` param).
- `SUPER_ADMIN_TOKEN` is used for superadmin authentication.

### 3. Database Setup
- Run initial migration for the public schema (tenants):
  ```bash
  npm run prisma:migrate
  ```
- Generate Prisma clients:
  ```bash
  npm run prisma:generate
  ```

### 4. Start the Server
```bash
npm start
```

## API Overview

### Superadmin Endpoints (`/superadmin`)
- `GET /superadmin/tenants` — List all tenants (requires `SUPER_ADMIN_TOKEN` in `Authorization` header)
- `POST /superadmin/tenants` — Create a new tenant `{ name, schemaName }`
  - Creates a new schema in Postgres and runs migrations
- `POST /superadmin/tenants/:schema/users` — Create a user in a tenant schema `{ email, name, password }`

### Tenant Endpoints (`/tenant`)
- `POST /tenant/login` — Authenticate a tenant user `{ email, password, schema }`
  - Returns a JWT token

### Contacts Endpoints (`/contacts`)
- `GET /contacts` — List contacts for the authenticated user (requires tenant JWT)
- `POST /contacts` — Create a contact `{ name, email }` (requires tenant JWT)

## Multi-Tenancy Approach
- **Tenants** are tracked in the public schema (`Tenant` model).
- Each tenant gets a dedicated Postgres schema (created dynamically).
- User and contact data are stored in the tenant's schema, using a separate Prisma client per schema.
- Superadmin can manage tenants and users across all schemas.

## Development & Testing
- Use Docker Compose for local Postgres if desired (`docker-compose.yml` in project root).
- See `prisma/` for schema definitions and migrations.
- See `routes/` for API logic.

## Scripts
- `npm start` — Start the server
- `npm run prisma:migrate` — Run migrations for the public schema
- `npm run prisma:generate` — Generate Prisma clients for both schemas