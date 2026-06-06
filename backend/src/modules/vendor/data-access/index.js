'use strict';

const sequelize = require('../../../config/db');
const { UnknownError } = require('../../../utils/errors');
const makeVendorDb = require('./vendor-db');

const vendorDb = makeVendorDb({ sequelize, UnknownError });

module.exports = {
  vendorDb,
};
