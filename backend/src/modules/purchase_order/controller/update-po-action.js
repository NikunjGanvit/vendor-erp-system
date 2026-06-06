'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, updatePOUseCase }) {
  return async function updatePOAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await updatePOUseCase({
        id: parseInt(id, 10),
        updateData,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in updatePOAction');
      return createErrorResponse(error, res);
    }
  };
};
