const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma');
const { JWT_SECRET } = require('../config');
const validate = require('../middleware/validate');
const { tenantLoginSchema } = require('../schemas/schemas');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', validate(tenantLoginSchema), async (req, res) => {
  const { email, password, tenant } = req.body;
  try {
    const tenantRow = await prisma.tenant.findFirst({ where: { name: tenant } });
    if (!tenantRow) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    const user = await prisma.user.findFirst({ where: { email, tenantId: tenantRow.tenant_id } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ tenantId: tenantRow.tenant_id, user_id: user.user_id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 