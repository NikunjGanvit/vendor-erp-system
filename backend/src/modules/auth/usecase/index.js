'use strict';

const { login, register, verifyToken, changePassword } = require('./auth');

module.exports = {
  login,
  register,
  verifyToken,
  changePassword,
};
