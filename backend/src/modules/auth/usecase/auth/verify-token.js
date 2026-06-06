'use strict';

module.exports = function ({
  jwt,
  jwtSecret,
  AuthenticationError,
}) {
  return async function verifyToken({ token, logger }) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (err) {
      logger?.warn({ err: err.message }, 'JWT Token verification failed');
      throw new AuthenticationError('Invalid or expired authentication token');
    }
  };
};
