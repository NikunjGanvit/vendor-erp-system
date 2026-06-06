'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  cookieName,
}) {
  return async function logoutAction(req, res) {
    const logger = req.log;

    try {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return createSuccessResponse(200, { message: 'Logged out successfully' }, res);
    } catch (error) {
      logger?.error(error, 'Error in logoutAction');
      return createErrorResponse(error, res);
    }
  };
};
