'use strict';

const { createUser, getUserById, updateUser, deleteUser, listUsers } = require('./users');

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
};
