const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const superAdminAuthMiddleware = require('../middleware/superAdminAuthMiddleware');
const bcrypt = require('bcryptjs');
const validate = require('../middleware/validate');
const { tenantCreateSchema, userCreateSchema } = require('../schemas/schemas');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/tenants', superAdminAuthMiddleware, async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});

router.post('/tenants', superAdminAuthMiddleware, validate(tenantCreateSchema), async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await prisma.tenant.findFirst({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: 'Tenant name already exists' });
    }
    const tenant = await prisma.tenant.create({ data: { name } });
    res.status(201).json({ message: 'Tenant created', tenant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tenants/:tenantId/users', superAdminAuthMiddleware, validate(userCreateSchema), async (req, res) => {
  const { tenantId } = req.params;
  const { email, name, password } = req.body;
  try {
    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({ where: { tenant_id: tenantId } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, tenantId },
    });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 