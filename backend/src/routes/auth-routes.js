'use strict';

const express = require('express');
const router = express.Router();
const { registerAction, loginAction, logoutAction, meAction } = require('../modules/auth/controller');
const authMiddleware = require('../modules/auth/middleware/auth-middleware');

router.post('/auth/register', registerAction);
router.post('/auth/login', loginAction);
router.post('/auth/logout', logoutAction);
router.get('/auth/me', authMiddleware, meAction);

module.exports = router;
