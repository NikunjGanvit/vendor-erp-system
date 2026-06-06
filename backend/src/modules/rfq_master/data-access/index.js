'use strict';

const sequelize = require('../../../config/db');
const { UnknownError } = require('../../../utils/errors');
const makeRfqDb = require('./rfq-db');

const rfqDb = makeRfqDb({ sequelize, UnknownError });

module.exports = {
  rfqDb,
};
