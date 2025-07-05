const jwt = require('jsonwebtoken');
const { getTenantPrismaClient } = require('../prismaClientFactory');
const { JWT_SECRET } = require('../config');

const tenantAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.tenant = {
      schema: payload.schema,
      user_id: payload.user_id
    };
    req.prisma = getTenantPrismaClient(payload.schema);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = tenantAuthMiddleware; 