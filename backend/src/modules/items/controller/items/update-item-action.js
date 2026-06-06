'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateItemUseCase,
}) {
  return async function updateItemAction(req, res) {
    const logger = req.log;

    try {
      const itemId = parseInt(req.params.id, 10);
      const itemData = req.body;
      const updatedBy = req.user?.id || null;

      const result = await updateItemUseCase({
        id: itemId,
        itemData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in updateItemAction');
      return createErrorResponse(error, res);
    }
  };
};
