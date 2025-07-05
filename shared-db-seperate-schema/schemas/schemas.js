const Joi = require('joi');

// Schema for POST /contacts (contacts.js)
const contactCreateSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
});

// Schema for POST /tenants (superadmin.js)
const tenantCreateSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  schemaName: Joi.string().min(1).max(100).required(),
});

// Schema for POST /tenants/:schema/users (superadmin.js)
const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
});

// Schema for POST /login (tenant.js)
const tenantLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  schema: Joi.string().min(1).max(100).required(),
});

module.exports = {
  contactCreateSchema,
  tenantCreateSchema,
  userCreateSchema,
  tenantLoginSchema,
};
