'use strict';

const { createSuccessResponse, createErrorResponse } = require('../../../utils/response');

const makeCreateVendorAction = require('./create-vendor-action');
const makeGetVendorsAction = require('./get-vendors-action');
const makeGetVendorByIdAction = require('./get-vendor-by-id-action');
const makeUpdateVendorAction = require('./update-vendor-action');
const makeDeleteVendorAction = require('./delete-vendor-action');

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require('../usecase');

const createVendorAction = makeCreateVendorAction({
  createErrorResponse,
  createSuccessResponse,
  createVendorUseCase: createVendor,
});

const getVendorsAction = makeGetVendorsAction({
  createErrorResponse,
  createSuccessResponse,
  getVendorsUseCase: getVendors,
});

const getVendorByIdAction = makeGetVendorByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getVendorByIdUseCase: getVendorById,
});

const updateVendorAction = makeUpdateVendorAction({
  createErrorResponse,
  createSuccessResponse,
  updateVendorUseCase: updateVendor,
});

const deleteVendorAction = makeDeleteVendorAction({
  createErrorResponse,
  createSuccessResponse,
  deleteVendorUseCase: deleteVendor,
});

module.exports = {
  createVendorAction,
  getVendorsAction,
  getVendorByIdAction,
  updateVendorAction,
  deleteVendorAction,
};
