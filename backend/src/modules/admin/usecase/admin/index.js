'use strict';

const { userDb } = require('../../../users/data-access');
const { roleDb } = require('../../../roles/data-access');
const { UnknownError, ValidationError, ConflictError, NotFoundError } = require('../../../../utils/errors');
const Joi = require('joi');
const sequelize = require('../../../../config/db');

const makeAssignRole = require('./assign-role');

const assignRole = makeAssignRole({
  userDb,
  roleDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
});

module.exports = {
  assignRole,
};
