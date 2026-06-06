'use strict';

const Joi = require('joi');
const sequelize = require('../../../config/db');
const { rfqDb } = require('../data-access');
const {
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
} = require('../../../utils/errors');

const makeCreateRFQ = require('./create-rfq');
const makeGetRFQs = require('./get-rfqs');
const makeGetRFQById = require('./get-rfq-by-id');
const makeUpdateRFQ = require('./update-rfq');
const makeDeleteRFQ = require('./delete-rfq');

const createRFQ = makeCreateRFQ({
  rfqDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getRFQs = makeGetRFQs({
  rfqDb,
  Joi,
  UnknownError,
});

const getRFQById = makeGetRFQById({
  rfqDb,
  Joi,
  NotFoundError,
  ValidationError,
});

const updateRFQ = makeUpdateRFQ({
  rfqDb,
  Joi,
  NotFoundError,
  ValidationError,
});

const deleteRFQ = makeDeleteRFQ({
  rfqDb,
  Joi,
  NotFoundError,
  ValidationError,
});

module.exports = {
  createRFQ,
  getRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
};
