'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  loginUseCase,
  cookieName,
}) {
  return async function loginAction(req, res) {
    const logger = req.log;

    try {
      const { email, password } = req.body;

      const { token, user } = await loginUseCase({
        email,
        password,
        logger,
      });

      // Set HTTP-only Cookie
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return createSuccessResponse(200, { user }, res);
    } catch (error) {
      logger?.error(error, 'Error in loginAction');
      return createErrorResponse(error, res);
    }
  };
};
