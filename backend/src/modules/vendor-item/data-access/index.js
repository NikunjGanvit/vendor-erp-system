'use strict';

const sequelize = require('../../../config/db');
const { UnknownError } = require('../../../utils/errors');
const makeVendorItemDb = require('./vendor-item');

const vendorItemDb = makeVendorItemDb({ sequelize, UnknownError });

module.exports = {
  vendorItemDb,
};
