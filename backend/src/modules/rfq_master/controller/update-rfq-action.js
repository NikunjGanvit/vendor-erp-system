'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, updateRFQUseCase }) {
  return async function updateRFQAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await updateRFQUseCase({
        id: parseInt(id, 10),
        updateData,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in updateRFQAction');
      return createErrorResponse(error, res);
    }
  };
};
