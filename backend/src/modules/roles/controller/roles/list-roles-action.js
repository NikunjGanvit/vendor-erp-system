'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  listRolesUseCase,
}) {
  return async function listRolesAction(req, res) {
    const logger = req.log;

    try {
      const searchParams = req.body;

      const result = await listRolesUseCase({
        searchParams,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in listRolesAction');
      return createErrorResponse(error, res);
    }
  };
};
