'use strict';

const makeCreateItem = require('./create-item');
const makeGetItems = require('./get-items');
const makeGetItem = require('./get-item');
const makeUpdateItem = require('./update-item');
const makeDeleteItem = require('./delete-item');

const { itemDb } = require('../../data-access');
const Joi = require('joi');
const sequelize = require('../../../config/db');
const {
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
} = require('../../../utils/errors');

const createItem = makeCreateItem({
  itemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getItems = makeGetItems({
  itemDb,
  buildFilterV2: require('eva-utilities').buildFilterV2,
  buildSort: require('eva-utilities').buildSort,
  NotFoundError,
  UnknownError,
});

const getItem = makeGetItem({
  itemDb,
  NotFoundError,
  UnknownError,
});

const updateItem = makeUpdateItem({
  itemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
});

const deleteItem = makeDeleteItem({
  itemDb,
  NotFoundError,
  UnknownError,
});

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
