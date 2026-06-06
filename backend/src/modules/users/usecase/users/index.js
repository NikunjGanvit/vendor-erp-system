'use strict';

const { userDb } = require('../../data-access');
const { UnknownError, ValidationError, ConflictError, NotFoundError } = require('../../../../utils/errors');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const sequelize = require('../../../../config/db');
const makeCreateUser = require('./create-user');
const makeGetUserById = require('./get-user-by-id');
const makeUpdateUser = require('./update-user');
const makeDeleteUser = require('./delete-user');
const makeListUsers = require('./list-users');

const createUser = makeCreateUser({
  userDb,
  Joi,
  bcrypt,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getUserById = makeGetUserById({
  userDb,
  NotFoundError,
  ValidationError,
  Joi,
});

const updateUser = makeUpdateUser({
  userDb,
  Joi,
  bcrypt,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
});

const deleteUser = makeDeleteUser({
  userDb,
  NotFoundError,
  ValidationError,
  UnknownError,
  sequelize,
  Joi,
});

const listUsers = makeListUsers({
  userDb,
  ValidationError,
  Joi,
});

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
};
