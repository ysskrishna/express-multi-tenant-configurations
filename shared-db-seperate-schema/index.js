const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const superadminRoutes = require('./routes/superadmin');
const tenantRoutes = require('./routes/tenant');
const contactsRoutes = require('./routes/contacts');
const { PORT } = require('./config');

app.use('/superadmin', superadminRoutes);
app.use('/tenant', tenantRoutes);
app.use('/contacts', contactsRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to ysskrishna seperated schema API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 