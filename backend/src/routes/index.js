'use strict';

const express = require('express');
const router = express.Router();
const userRoutes = require('./user-routes');
const itemRoutes = require('./item-routes');
const vendorItemRoutes = require('./vendor-item.routes');
const vendorRoutes = require('./vendor-routes');

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vendor ERP Backend API' });
});

router.use('/', userRoutes);
router.use('/', itemRoutes);
router.use('/vendor-items', vendorItemRoutes);
router.use('/', vendorRoutes);

module.exports = router;
