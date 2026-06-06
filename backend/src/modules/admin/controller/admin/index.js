'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { assignRole } = require('../../usecase');

const makeAssignRoleAction = require('./assign-role-action');

const assignRoleAction = makeAssignRoleAction({
  createErrorResponse,
  createSuccessResponse,
  assignRoleUseCase: assignRole,
});

module.exports = {
  assignRoleAction,
};
