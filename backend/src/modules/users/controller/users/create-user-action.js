'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase,
}) {
  return async function createUserAction(req, res) {
    const logger = req.log;

    try {
      const userData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createUserUseCase({
        userData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createUserAction');
      return createErrorResponse(error, res);
    }
  };
};
