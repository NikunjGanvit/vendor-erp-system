'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getItemsUseCase,
}) {
  return async function getItemsAction(req, res) {
    const logger = req.log;

    try {
      const query = req.query;
      const result = await getItemsUseCase({ query, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getItemsAction');
      return createErrorResponse(error, res);
    }
  };
};
