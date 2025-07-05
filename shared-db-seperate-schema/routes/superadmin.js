const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const superAdminAuthMiddleware = require('../middleware/superAdminAuthMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/tenants', superAdminAuthMiddleware, async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});

router.post('/tenants', superAdminAuthMiddleware, async (req, res) => {
  // TODO: Create tenant, schema, and run migration
  res.json({ message: 'Tenant creation not yet implemented' });
});

router.post('/tenants/:schema/users', superAdminAuthMiddleware, async (req, res) => {
  // TODO: Create user in target tenant schema
  res.json({ message: 'Tenant user creation not yet implemented' });
});

module.exports = router; 