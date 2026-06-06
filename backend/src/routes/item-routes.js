'use strict';

const express = require('express');
const router = express.Router();
const {
  createItemAction,
  getItemsAction,
  getItemAction,
  updateItemAction,
  deleteItemAction,
} = require('../modules/items/controller');

router.post('/items', createItemAction);
router.get('/items', getItemsAction);
router.get('/items/:id', getItemAction);
router.put('/items/:id', updateItemAction);
router.delete('/items/:id', deleteItemAction);

module.exports = router;
