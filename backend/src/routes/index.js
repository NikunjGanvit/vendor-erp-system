'use strict';

const express = require('express');
const router = express.Router();
const userRoutes = require('./user-routes');
const itemRoutes = require('./item-routes');
const vendorItemRoutes = require('./vendor-item.routes');
const vendorRoutes = require('./vendor-routes');
const authRoutes = require('./auth-routes');
const roleRoutes = require('./role-routes');
const adminRoutes = require('./admin-routes');
const purchaseOrderRoutes = require('./purchase-order-routes');
const rfqRoutes = require('./rfq-routes');
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vendor ERP Backend API' });
});

router.use('/', userRoutes);
router.use('/', itemRoutes);
router.use('/vendor-items', vendorItemRoutes);
router.use('/', vendorRoutes);
router.use('/', authRoutes);
router.use('/', roleRoutes);
router.use('/', adminRoutes);
router.use('/', purchaseOrderRoutes);
router.use('/', rfqRoutes);

module.exports = router;
