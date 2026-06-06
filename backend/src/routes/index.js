'use strict';

const express = require('express');
const router = express.Router();
const userRoutes = require('./user-routes');
const authRoutes = require('./auth-routes');
const roleRoutes = require('./role-routes');
const adminRoutes = require('./admin-routes');

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vendor ERP Backend API' });
});

router.use('/', userRoutes);
router.use('/', authRoutes);
router.use('/', roleRoutes);
router.use('/', adminRoutes);

module.exports = router;
