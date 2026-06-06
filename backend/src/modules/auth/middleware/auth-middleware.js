'use strict';

const devConfig = require('../../../config/development');
const { verifyToken } = require('../usecase');
const { userDb } = require('../../users/data-access');
const { AuthenticationError } = require('../../../utils/errors');
const { createErrorResponse } = require('../../../utils/response');

const cookieName = devConfig.auth.cookieName;

module.exports = async function authMiddleware(req, res, next) {
  const logger = req.log;

  try {
    // Extract token from HTTP-only cookie or Authorization header
    let token = req.cookies?.[cookieName];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AuthenticationError('Authentication token is missing');
    }

    // Verify and decode token
    const decoded = await verifyToken({ token, logger });

    // Fetch user details to ensure user is active and exists
    const user = await userDb.findByEmail({ email: decoded.email, logger });
    if (!user) {
      throw new AuthenticationError('User account not found');
    }

    if (!user.is_active) {
      throw new AuthenticationError('User account is inactive');
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (error) {
    logger?.error(error, 'Authentication middleware block');
    return createErrorResponse(error, res);
  }
};
