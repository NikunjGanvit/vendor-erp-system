'use strict';

const jwt = require('jsonwebtoken');
const devConfig = require('../../../../config/development');
const { userDb } = require('../../../users/data-access');
const { createUser: createUserUseCase } = require('../../../users/usecase');
const { ValidationError, AuthenticationError, ConflictError, NotFoundError, UnknownError } = require('../../../../utils/errors');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const makeLogin = require('./login');
const makeRegister = require('./register');
const makeVerifyToken = require('./verify-token');
const makeChangePassword = require('./change-password');

const jwtSecret = devConfig.auth.jwtSecret;
const jwtExpiresIn = devConfig.auth.jwtExpiresIn;

const login = makeLogin({
  userDb,
  Joi,
  bcrypt,
  jwt,
  jwtSecret,
  jwtExpiresIn,
  ValidationError,
  AuthenticationError,
});

const register = makeRegister({
  createUserUseCase,
  jwt,
  jwtSecret,
  jwtExpiresIn,
});

const verifyToken = makeVerifyToken({
  jwt,
  jwtSecret,
  AuthenticationError,
});

const changePassword = makeChangePassword({
  userDb,
  Joi,
  bcrypt,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  UnknownError,
});

module.exports = {
  login,
  register,
  verifyToken,
  changePassword,
};
