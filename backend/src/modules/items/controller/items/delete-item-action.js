'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteItemUseCase,
}) {
  return async function deleteItemAction(req, res) {
    const logger = req.log;

    try {
      const itemId = parseInt(req.params.id, 10);
      const deletedBy = req.user?.id || null;
      const result = await deleteItemUseCase({ id: itemId, deletedBy, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteItemAction');
      return createErrorResponse(error, res);
    }
  };
};
