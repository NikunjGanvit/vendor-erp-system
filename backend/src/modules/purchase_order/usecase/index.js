'use strict';

const Joi = require('joi');
const sequelize = require('../../../config/db');
const { poDb } = require('../data-access');
const {
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
} = require('../../../utils/errors');

const makeCreatePO = require('./create-po');
const makeGetPOs = require('./get-pos');
const makeGetPOById = require('./get-po-by-id');
const makeUpdatePO = require('./update-po');
const makeDeletePO = require('./delete-po');

const createPO = makeCreatePO({
  poDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getPOs = makeGetPOs({
  poDb,
  Joi,
  UnknownError,
});

const getPOById = makeGetPOById({
  poDb,
  Joi,
  NotFoundError,
  ValidationError,
});

const updatePO = makeUpdatePO({
  poDb,
  Joi,
  NotFoundError,
  ValidationError,
});

const deletePO = makeDeletePO({
  poDb,
  Joi,
  NotFoundError,
  ValidationError,
});

module.exports = {
  createPO,
  getPOs,
  getPOById,
  updatePO,
  deletePO,
};
