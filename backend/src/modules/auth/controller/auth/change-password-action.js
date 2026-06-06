'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  changePasswordUseCase,
}) {
  return async function changePasswordAction(req, res) {
    const logger = req.log;
    const { oldPassword, newPassword } = req.body;
    const email = req.user?.email;

    try {
      const result = await changePasswordUseCase({
        email,
        oldPassword,
        newPassword,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in changePasswordAction');
      return createErrorResponse(error, res);
    }
  };
};
