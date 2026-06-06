'use strict';

const express = require('express');
const router = express.Router();
const userRoutes = require('./user-routes');
const authRoutes = require('./auth-routes');

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vendor ERP Backend API' });
});

router.use('/', userRoutes);
router.use('/', authRoutes);

module.exports = router;
