'use strict';

const express = require('express');
const router = express.Router();
const {
  createPOAction,
  getPOsAction,
  getPOByIdAction,
  updatePOAction,
  deletePOAction,
} = require('../modules/purchase_order/controller');

// Create Purchase Order (with auto-create RFQ)
router.post('/purchase-orders', createPOAction);

// Get all Purchase Orders
router.get('/purchase-orders', getPOsAction);

// Get Purchase Order by ID (with optional details)
router.get('/purchase-orders/:id', getPOByIdAction);

// Update Purchase Order
router.put('/purchase-orders/:id', updatePOAction);

// Delete Purchase Order
router.delete('/purchase-orders/:id', deletePOAction);

module.exports = router;
