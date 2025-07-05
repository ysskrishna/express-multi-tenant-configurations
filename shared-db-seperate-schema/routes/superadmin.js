const express = require('express');
const { getPrismaClient } = require('../prismaClientFactory');
const superAdminAuthMiddleware = require('../middleware/superAdminAuthMiddleware');
const { getTenantPrismaClient } = require('../prismaClientFactory');
const { Client } = require('pg');
const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');
const { DATABASE_URL } = require('../config');
const checkTenantSchemaMiddleware = require('../middleware/checkTenantSchemaMiddleware');
const validate = require('../middleware/validate');
const { tenantCreateSchema, userCreateSchema } = require('../schemas/schemas');

const router = express.Router();
const prisma = getPrismaClient();

router.get('/tenants', superAdminAuthMiddleware, async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});

router.post('/tenants', superAdminAuthMiddleware, validate(tenantCreateSchema), async (req, res) => {
  const { name, schemaName } = req.body;
  if (!name || !schemaName) {
    return res.status(400).json({ error: 'name and schemaName are required' });
  }
  try {
    // 1. Insert tenant in public schema
    const existing = await prisma.tenant.findFirst({ where: { OR: [{ name }, { schemaName }] } });
    if (existing) {
      return res.status(409).json({ error: 'Tenant name or schema already exists' });
    }
    const tenant = await prisma.tenant.create({ data: { name, schemaName } });

    // 2. Create schema in Postgres
    const pgClient = new Client({ connectionString: DATABASE_URL });
    await pgClient.connect();
    await pgClient.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await pgClient.end();

    // 3. Run migration for new schema
    // Set DATABASE_URL with schema param
    const urlWithSchema = DATABASE_URL.includes('schema=')
      ? DATABASE_URL.replace(/(schema=)[^&]+/, `$1${schemaName}`)
      : DATABASE_URL + (DATABASE_URL.includes('?') ? '&' : '?') + `schema=${schemaName}`;
      execSync(
        `npx prisma db push --schema=prisma/tenant_schema.prisma`,
        {
          env: { ...process.env, DATABASE_URL: urlWithSchema },
          stdio: 'inherit',
        }
      );

    res.status(201).json({ message: 'Tenant created', tenant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tenants/:schema/users', superAdminAuthMiddleware, checkTenantSchemaMiddleware, validate(userCreateSchema), async (req, res) => {
  const { schema } = req.params;
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'email, name, and password are required' });
  }
  try {
    const tenantPrisma = getTenantPrismaClient(schema);
    // Check if user already exists
    const existingUser = await tenantPrisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await tenantPrisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 