'use strict';

const express = require('express');
const router = express.Router();
const {
  createVendorAction,
  getVendorsAction,
  getVendorByIdAction,
  updateVendorAction,
  deleteVendorAction,
} = require('../modules/vendor/controller');

router.post('/vendors', createVendorAction);
router.get('/vendors', getVendorsAction);
router.get('/vendors/:id', getVendorByIdAction);
router.put('/vendors/:id', updateVendorAction);
router.delete('/vendors/:id', deleteVendorAction);

module.exports = router;
