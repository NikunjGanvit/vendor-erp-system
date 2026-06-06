'use strict';

const { createUserAction, getUserByIdAction, updateUserAction, deleteUserAction, listUsersAction } = require('./users');

module.exports = {
  createUserAction,
  getUserByIdAction,
  updateUserAction,
  deleteUserAction,
  listUsersAction,
};
