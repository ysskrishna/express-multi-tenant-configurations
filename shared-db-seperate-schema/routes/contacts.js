const express = require('express');
const tenantAuthMiddleware = require('../middleware/tenantAuthMiddleware');

const router = express.Router();

router.get('/', tenantAuthMiddleware, async (req, res) => {
  try {
    const contacts = await req.prisma.contact.findMany({ where: { userId: req.tenant.user_id } });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', tenantAuthMiddleware, async (req, res) => {
  const { name, email } = req.body;
  try {
    const contact = await req.prisma.contact.create({
      data: { name, email, userId: req.tenant.user_id },
    });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 