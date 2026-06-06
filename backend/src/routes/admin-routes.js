'use strict';

const express = require('express');
const router = express.Router();
const { assignRoleAction } = require('../modules/admin/controller');
const authMiddleware = require('../modules/auth/middleware/auth-middleware');

router.post('/admin/assign-role', authMiddleware, assignRoleAction);

module.exports = router;
