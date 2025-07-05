const { PrismaClient } = require('./generated/tenant');

function getTenantPrismaClient(schemaName) {
  let baseUrl = process.env.DATABASE_URL;
  // If schema param exists, replace it; otherwise, append it
  if (baseUrl.includes('schema=')) {
    baseUrl = baseUrl.replace(/(schema=)[^&]+/, `$1${schemaName}`);
  } else {
    const sep = baseUrl.includes('?') ? '&' : '?';
    baseUrl = `${baseUrl}${sep}schema=${schemaName}`;
  }
  return new PrismaClient({
    datasources: {
      db: { url: baseUrl }
    }
  });
}

module.exports = { getTenantPrismaClient }; 