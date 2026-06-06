'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getItemUseCase,
}) {
  return async function getItemAction(req, res) {
    const logger = req.log;

    try {
      const itemId = parseInt(req.params.id, 10);
      const result = await getItemUseCase({ id: itemId, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getItemAction');
      return createErrorResponse(error, res);
    }
  };
};
