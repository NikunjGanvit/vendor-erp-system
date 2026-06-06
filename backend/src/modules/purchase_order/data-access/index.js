'use strict';

const sequelize = require('../../../config/db');
const { UnknownError } = require('../../../utils/errors');
const makePoDb = require('./po-db');

const poDb = makePoDb({ sequelize, UnknownError });

module.exports = {
  poDb,
};
