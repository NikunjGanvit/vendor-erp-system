'use strict';

const express = require('express');
const router = express.Router();
const {
  createRoleAction,
  getRoleByIdAction,
  updateRoleAction,
  deleteRoleAction,
  listRolesAction,
} = require('../modules/roles/controller');
const authMiddleware = require('../modules/auth/middleware/auth-middleware');

router.post('/roles', authMiddleware, createRoleAction);
router.post('/roles/list', authMiddleware, listRolesAction);
router.get('/roles/:id', authMiddleware, getRoleByIdAction);
router.patch('/roles/:id', authMiddleware, updateRoleAction);
router.delete('/roles/:id', authMiddleware, deleteRoleAction);

module.exports = router;
