const express = require('express');
const tenantAuthMiddleware = require('../middleware/tenantAuthMiddleware');
const validate = require('../middleware/validate');
const { contactCreateSchema } = require('../schemas/schemas');
const { PrismaClient } = require('../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', tenantAuthMiddleware, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.tenant.user_id, tenantId: req.tenant.tenantId },
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', tenantAuthMiddleware, validate(contactCreateSchema), async (req, res) => {
  const { name, email } = req.body;
  try {
    const contact = await prisma.contact.create({
      data: { name, email, userId: req.tenant.user_id, tenantId: req.tenant.tenantId },
    });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 