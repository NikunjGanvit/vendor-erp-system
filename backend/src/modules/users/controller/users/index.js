'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createUser, getUserById, updateUser, deleteUser, listUsers } = require('../../usecase');
const makeCreateUserAction = require('./create-user-action');
const makeGetUserByIdAction = require('./get-user-by-id-action');
const makeUpdateUserAction = require('./update-user-action');
const makeDeleteUserAction = require('./delete-user-action');
const makeListUsersAction = require('./list-users-action');

const createUserAction = makeCreateUserAction({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase: createUser,
});

const getUserByIdAction = makeGetUserByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getUserByIdUseCase: getUserById,
});

const updateUserAction = makeUpdateUserAction({
  createErrorResponse,
  createSuccessResponse,
  updateUserUseCase: updateUser,
});

const deleteUserAction = makeDeleteUserAction({
  createErrorResponse,
  createSuccessResponse,
  deleteUserUseCase: deleteUser,
});

const listUsersAction = makeListUsersAction({
  createErrorResponse,
  createSuccessResponse,
  listUsersUseCase: listUsers,
});

module.exports = {
  createUserAction,
  getUserByIdAction,
  updateUserAction,
  deleteUserAction,
  listUsersAction,
};
