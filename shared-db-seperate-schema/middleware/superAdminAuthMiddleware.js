const { SUPER_ADMIN_TOKEN } = require('../config');

const superAdminAuthMiddleware = (req, res, next) => {
  const token = req.header('x-super-admin-token');
  if (!token || token !== SUPER_ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing super admin token' });
  }
  next();
};

module.exports = superAdminAuthMiddleware; 