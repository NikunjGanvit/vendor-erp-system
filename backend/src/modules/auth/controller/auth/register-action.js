'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  registerUseCase,
  cookieName,
}) {
  return async function registerAction(req, res) {
    const logger = req.log;

    try {
      const userData = req.body;

      const { token, user } = await registerUseCase({
        userData,
        logger,
      });

      // Set HTTP-only Cookie to log the user in immediately
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return createSuccessResponse(201, { user }, res);
    } catch (error) {
      logger?.error(error, 'Error in registerAction');
      return createErrorResponse(error, res);
    }
  };
};
