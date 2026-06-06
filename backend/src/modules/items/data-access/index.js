'use strict';

const sequelize = require('../../../config/db');
const { UnknownError } = require('../../../utils/errors');
const makeItemDb = require('./item-db');

const itemDb = makeItemDb({
  sequelize,
  UnknownError,
});

module.exports = {
  itemDb,
};
