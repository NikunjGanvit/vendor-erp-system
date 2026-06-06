'use strict';

const devConfig = require('../../../../config/development');
const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { login, register, changePassword } = require('../../usecase');

const makeLoginAction = require('./login-action');
const makeRegisterAction = require('./register-action');
const makeLogoutAction = require('./logout-action');
const makeMeAction = require('./me-action');
const makeChangePasswordAction = require('./change-password-action');

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

const changePasswordAction = makeChangePasswordAction({
  createErrorResponse,
  createSuccessResponse,
  changePasswordUseCase: changePassword,
});

module.exports = {
  loginAction,
  registerAction,
  logoutAction,
  meAction,
  changePasswordAction,
};
