'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createItemUseCase,
}) {
  return async function createItemAction(req, res) {
    const logger = req.log;

    try {
      const itemData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createItemUseCase({
        itemData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createItemAction');
      return createErrorResponse(error, res);
    }
  };
};
