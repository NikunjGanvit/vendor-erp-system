'use strict';

const { createItem, getItems, getItem, updateItem, deleteItem } = require('../../usecase');
const makeCreateItemAction = require('./create-item-action');
const makeGetItemsAction = require('./get-items-action');
const makeGetItemAction = require('./get-item-action');
const makeUpdateItemAction = require('./update-item-action');
const makeDeleteItemAction = require('./delete-item-action');
const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');

const createItemAction = makeCreateItemAction({
  createErrorResponse,
  createSuccessResponse,
  createItemUseCase: createItem,
});

const getItemsAction = makeGetItemsAction({
  createErrorResponse,
  createSuccessResponse,
  getItemsUseCase: getItems,
});

const getItemAction = makeGetItemAction({
  createErrorResponse,
  createSuccessResponse,
  getItemUseCase: getItem,
});

const updateItemAction = makeUpdateItemAction({
  createErrorResponse,
  createSuccessResponse,
  updateItemUseCase: updateItem,
});

const deleteItemAction = makeDeleteItemAction({
  createErrorResponse,
  createSuccessResponse,
  deleteItemUseCase: deleteItem,
});

module.exports = {
  createItemAction,
  getItemsAction,
  getItemAction,
  updateItemAction,
  deleteItemAction,
};
