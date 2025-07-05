const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getTenantPrismaClient } = require('../prismaClientFactory');
const { JWT_SECRET } = require('../config');
const validate = require('../middleware/validate');
const { tenantLoginSchema } = require('../schemas/schemas');

const router = express.Router();

router.post('/login', validate(tenantLoginSchema), async (req, res) => {
  const { email, password, schema } = req.body;
  if (!schema) return res.status(400).json({ error: 'Schema required' });
  const prisma = getTenantPrismaClient(schema);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ schema, user_id: user.user_id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 