'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  listUsersUseCase,
}) {
  return async function listUsersAction(req, res) {
    const logger = req.log;

    try {
      const searchParams = req.body;

      const result = await listUsersUseCase({
        searchParams,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in listUsersAction');
      return createErrorResponse(error, res);
    }
  };
};
