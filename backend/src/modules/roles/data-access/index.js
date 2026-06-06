'use strict';

const sequelize = require('../../../config/db');
const makeRoleDb = require('./role-db');

const roleDb = makeRoleDb({ sequelize });

module.exports = {
  roleDb,
};
