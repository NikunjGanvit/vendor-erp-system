'use strict';
const { createSuccessResponse, createErrorResponse } = require('../../../utils/response');

const makeCreateVendorItemAction = require('./create-vendor-item-action');
const makeGetVendorItemsAction = require('./get-vendor-items-action');
const makeGetVendorItemByIdAction = require('./get-vendor-item-by-id-action');
const makeUpdateVendorItemAction = require('./update-vendor-item-action');
const makeDeleteVendorItemAction = require('./delete-vendor-item-action');

const { createVendorItem, getVendorItems, getVendorItemById, updateVendorItem, deleteVendorItem } = require('../usecase');

const createVendorItemAction = makeCreateVendorItemAction({
  createErrorResponse,
  createSuccessResponse,
  createVendorItemUseCase: createVendorItem,
});

const getVendorItemsAction = makeGetVendorItemsAction({
  createErrorResponse,
  createSuccessResponse,
  getVendorItemsUseCase: getVendorItems,
});

const getVendorItemByIdAction = makeGetVendorItemByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getVendorItemByIdUseCase: getVendorItemById,
});

const updateVendorItemAction = makeUpdateVendorItemAction({
  createErrorResponse,
  createSuccessResponse,
  updateVendorItemUseCase: updateVendorItem,
});

const deleteVendorItemAction = makeDeleteVendorItemAction({
  createErrorResponse,
  createSuccessResponse,
  deleteVendorItemUseCase: deleteVendorItem,
});

module.exports = {
  createVendorItemAction,
  getVendorItemsAction,
  getVendorItemByIdAction,
  updateVendorItemAction,
  deleteVendorItemAction,
};