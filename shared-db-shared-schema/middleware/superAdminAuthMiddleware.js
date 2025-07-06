const { SUPER_ADMIN_TOKEN } = require('../config');

const superAdminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (token !== SUPER_ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = superAdminAuthMiddleware; 