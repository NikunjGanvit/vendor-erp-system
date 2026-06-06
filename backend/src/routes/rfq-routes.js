'use strict';

const express = require('express');
const router = express.Router();
const {
  createRFQAction,
  getRFQsAction,
  getRFQByIdAction,
  updateRFQAction,
  deleteRFQAction,
} = require('../modules/rfq_master/controller');

// Create RFQ Master
router.post('/rfqs', createRFQAction);

// Get all RFQs
router.get('/rfqs', getRFQsAction);

// Get RFQ by ID (with optional details and quotations count)
router.get('/rfqs/:id', getRFQByIdAction);

// Update RFQ
router.put('/rfqs/:id', updateRFQAction);

// Delete RFQ
router.delete('/rfqs/:id', deleteRFQAction);

module.exports = router;
