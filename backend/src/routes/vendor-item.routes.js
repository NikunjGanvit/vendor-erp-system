'use strict';
const express = require('express');
const router = express.Router();
const {
  createVendorItemAction,
  getVendorItemsAction,
  getVendorItemByIdAction,
  updateVendorItemAction,
  deleteVendorItemAction,
} = require('../modules/vendor-item/controller');

router.post('/', createVendorItemAction);
router.get('/', getVendorItemsAction);
router.get('/:id', getVendorItemByIdAction);
router.put('/:id', updateVendorItemAction);
router.delete('/:id', deleteVendorItemAction);

module.exports = router;