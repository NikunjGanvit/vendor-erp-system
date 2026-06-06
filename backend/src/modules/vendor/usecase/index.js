'use strict';

const Joi = require('joi');
const sequelize = require('../../../config/db');
const { vendorDb } = require('../data-access');
const {
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
} = require('../../../utils/errors');
const { buildFilterV2, buildSort } = require('eva-utilities');

const makeCreateVendor = require('./create-vendor');
const makeGetVendors = require('./get-vendors');
const makeGetVendorById = require('./get-vendor-by-id');
const makeUpdateVendor = require('./update-vendor');
const makeDeleteVendor = require('./delete-vendor');

const createVendor = makeCreateVendor({
  vendorDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getVendors = makeGetVendors({
  vendorDb,
  buildFilterV2,
  buildSort,
  UnknownError,
});

const getVendorById = makeGetVendorById({
  vendorDb,
  NotFoundError,
  UnknownError,
});

const updateVendor = makeUpdateVendor({
  vendorDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
});

const deleteVendor = makeDeleteVendor({
  vendorDb,
  sequelize,
  NotFoundError,
  UnknownError,
});

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
