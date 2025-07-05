const { Client } = require('pg');
const { DATABASE_URL } = require('../config');

async function schemaExists(schemaName, client) {
  const res = await client.query(
    'SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1',
    [schemaName]
  );
  return res.rows.length > 0;
}

const checkTenantSchemaMiddleware = async (req, res, next) => {
  const schema = req.params.schema || req.body.schema;
  if (!schema) {
    return res.status(400).json({ error: 'Schema is required' });
  }
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    const exists = await schemaExists(schema, client);
    await client.end();
    if (!exists) {
      return res.status(404).json({ error: `Schema '${schema}' does not exist` });
    }
    next();
  } catch (err) {
    await client.end();
    res.status(500).json({ error: err.message });
  }
};

module.exports = checkTenantSchemaMiddleware; 