'use strict';

const devConfig = require('../../../../config/development');
const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { login, register } = require('../../usecase');

const makeLoginAction = require('./login-action');
const makeRegisterAction = require('./register-action');
const makeLogoutAction = require('./logout-action');
const makeMeAction = require('./me-action');

const cookieName = devConfig.auth.cookieName;

const loginAction = makeLoginAction({
  createErrorResponse,
  createSuccessResponse,
  loginUseCase: login,
  cookieName,
});

const registerAction = makeRegisterAction({
  createErrorResponse,
  createSuccessResponse,
  registerUseCase: register,
  cookieName,
});

const logoutAction = makeLogoutAction({
  createErrorResponse,
  createSuccessResponse,
  cookieName,
});

const meAction = makeMeAction({
  createErrorResponse,
  createSuccessResponse,
});

module.exports = {
  loginAction,
  registerAction,
  logoutAction,
  meAction,
};
