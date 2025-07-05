const { PrismaClient } = require('@prisma/client');

const clients = {};

function getPrismaClient(schema) {
  if (!clients[schema]) {
    clients[schema] = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL.replace('schema=public', `schema=${schema}`),
        },
      },
    });
  }
  return clients[schema];
}

module.exports = { getPrismaClient }; 