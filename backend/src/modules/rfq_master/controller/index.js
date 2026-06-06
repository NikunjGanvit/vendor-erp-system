'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../utils/response');

const makeCreateRFQAction = require('./create-rfq-action');
const makeGetRFQsAction = require('./get-rfqs-action');
const makeGetRFQByIdAction = require('./get-rfq-by-id-action');
const makeUpdateRFQAction = require('./update-rfq-action');
const makeDeleteRFQAction = require('./delete-rfq-action');

const {
  createRFQ,
  getRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
} = require('../usecase');

const createRFQAction = makeCreateRFQAction({
  createErrorResponse,
  createSuccessResponse,
  createRFQUseCase: createRFQ,
});

const getRFQsAction = makeGetRFQsAction({
  createErrorResponse,
  createSuccessResponse,
  getRFQsUseCase: getRFQs,
});

const getRFQByIdAction = makeGetRFQByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getRFQByIdUseCase: getRFQById,
});

const updateRFQAction = makeUpdateRFQAction({
  createErrorResponse,
  createSuccessResponse,
  updateRFQUseCase: updateRFQ,
});

const deleteRFQAction = makeDeleteRFQAction({
  createErrorResponse,
  createSuccessResponse,
  deleteRFQUseCase: deleteRFQ,
});

module.exports = {
  createRFQAction,
  getRFQsAction,
  getRFQByIdAction,
  updateRFQAction,
  deleteRFQAction,
};
