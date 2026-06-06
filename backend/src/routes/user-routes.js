'use strict';

const express = require('express');
const router = express.Router();
const { createUserAction } = require('../modules/users/controller');
const authMiddleware = require('../modules/auth/middleware/auth-middleware');

router.post('/users', authMiddleware, createUserAction);

module.exports = router;
