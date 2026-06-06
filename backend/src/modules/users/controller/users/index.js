'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createUser } = require('../../usecase');
const makeCreateUserAction = require('./create-user-action');

const createUserAction = makeCreateUserAction({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase: createUser,
});

module.exports = {
  createUserAction,
};
