'use strict';

const { login, register, verifyToken } = require('./auth');

module.exports = {
  login,
  register,
  verifyToken,
};
