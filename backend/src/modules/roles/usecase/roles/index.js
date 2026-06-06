'use strict';

const { roleDb } = require('../../data-access');
const { userDb } = require('../../../users/data-access');
const { UnknownError, ValidationError, ConflictError, NotFoundError } = require('../../../../utils/errors');
const Joi = require('joi');
const sequelize = require('../../../../config/db');

const makeCreateRole = require('./create-role');
const makeGetRoleById = require('./get-role-by-id');
const makeUpdateRole = require('./update-role');
const makeDeleteRole = require('./delete-role');
const makeListRoles = require('./list-roles');

const createRole = makeCreateRole({
  roleDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getRoleById = makeGetRoleById({
  roleDb,
  NotFoundError,
  ValidationError,
  Joi,
});

const updateRole = makeUpdateRole({
  roleDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
});

const deleteRole = makeDeleteRole({
  roleDb,
  userDb,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnknownError,
  sequelize,
  Joi,
});

const listRoles = makeListRoles({
  roleDb,
  ValidationError,
  Joi,
});

module.exports = {
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  listRoles,
};
