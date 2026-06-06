const express = require('express');
const router = express.Router();
const {
  createUserAction,
  getUserByIdAction,
  updateUserAction,
  deleteUserAction,
  listUsersAction,
} = require('../modules/users/controller');
const authMiddleware = require('../modules/auth/middleware/auth-middleware');

router.post('/users', authMiddleware, createUserAction);
router.post('/users/list', authMiddleware, listUsersAction);
router.get('/users/:id', authMiddleware, getUserByIdAction);
router.patch('/users/:id', authMiddleware, updateUserAction);
router.delete('/users/:id', authMiddleware, deleteUserAction);

module.exports = router;
