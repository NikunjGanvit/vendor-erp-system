'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../utils/response');

const makeCreatePOAction = require('./create-po-action');
const makeGetPOsAction = require('./get-pos-action');
const makeGetPOByIdAction = require('./get-po-by-id-action');
const makeUpdatePOAction = require('./update-po-action');
const makeDeletePOAction = require('./delete-po-action');

const {
  createPO,
  getPOs,
  getPOById,
  updatePO,
  deletePO,
} = require('../usecase');

const createPOAction = makeCreatePOAction({
  createErrorResponse,
  createSuccessResponse,
  createPOUseCase: createPO,
});

const getPOsAction = makeGetPOsAction({
  createErrorResponse,
  createSuccessResponse,
  getPOsUseCase: getPOs,
});

const getPOByIdAction = makeGetPOByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getPOByIdUseCase: getPOById,
});

const updatePOAction = makeUpdatePOAction({
  createErrorResponse,
  createSuccessResponse,
  updatePOUseCase: updatePO,
});

const deletePOAction = makeDeletePOAction({
  createErrorResponse,
  createSuccessResponse,
  deletePOUseCase: deletePO,
});

module.exports = {
  createPOAction,
  getPOsAction,
  getPOByIdAction,
  updatePOAction,
  deletePOAction,
};
