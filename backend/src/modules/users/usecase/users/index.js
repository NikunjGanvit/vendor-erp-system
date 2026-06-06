'use strict';

const { userDb } = require('../../data-access');
const { UnknownError, ValidationError, ConflictError } = require('../../../../utils/errors');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const sequelize = require('../../../../config/db');
const makeCreateUser = require('./create-user');

const createUser = makeCreateUser({
  userDb,
  Joi,
  bcrypt,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

module.exports = {
  createUser,
};
