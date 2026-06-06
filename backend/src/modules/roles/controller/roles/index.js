'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createRole, getRoleById, updateRole, deleteRole, listRoles } = require('../../usecase');

const makeCreateRoleAction = require('./create-role-action');
const makeGetRoleByIdAction = require('./get-role-by-id-action');
const makeUpdateRoleAction = require('./update-role-action');
const makeDeleteRoleAction = require('./delete-role-action');
const makeListRolesAction = require('./list-roles-action');

const createRoleAction = makeCreateRoleAction({
  createErrorResponse,
  createSuccessResponse,
  createRoleUseCase: createRole,
});

const getRoleByIdAction = makeGetRoleByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getRoleByIdUseCase: getRoleById,
});

const updateRoleAction = makeUpdateRoleAction({
  createErrorResponse,
  createSuccessResponse,
  updateRoleUseCase: updateRole,
});

const deleteRoleAction = makeDeleteRoleAction({
  createErrorResponse,
  createSuccessResponse,
  deleteRoleUseCase: deleteRole,
});

const listRolesAction = makeListRolesAction({
  createErrorResponse,
  createSuccessResponse,
  listRolesUseCase: listRoles,
});

module.exports = {
  createRoleAction,
  getRoleByIdAction,
  updateRoleAction,
  deleteRoleAction,
  listRolesAction,
};
