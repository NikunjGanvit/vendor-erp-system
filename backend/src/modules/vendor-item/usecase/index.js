'use strict';
const { vendorItemDb } = require('../data-access');
const { UnknownError, ValidationError, ConflictError } = require('../../../utils/errors');
const Joi = require('joi');
const sequelize = require('../../../config/db');

const makeCreateVendorItem = require('./create-vendor-item');
const makeGetVendorItems = require('./get-vendor-items');
const makeGetVendorItemById = require('./get-vendor-item-by-id');
const makeUpdateVendorItem = require('./update-vendor-item');
const makeDeleteVendorItem = require('./delete-vendor-item');

const createVendorItem = makeCreateVendorItem({
  vendorItemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getVendorItems = makeGetVendorItems({
  vendorItemDb,
  UnknownError,
});

const getVendorItemById = makeGetVendorItemById({
  vendorItemDb,
  UnknownError,
});

const updateVendorItem = makeUpdateVendorItem({
  vendorItemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
});

const deleteVendorItem = makeDeleteVendorItem({
  vendorItemDb,
  sequelize,
  UnknownError,
});

module.exports = {
  createVendorItem,
  getVendorItems,
  getVendorItemById,
  updateVendorItem,
  deleteVendorItem,
};