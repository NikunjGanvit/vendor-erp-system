'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, deleteRFQUseCase }) {
  return async function deleteRFQAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const result = await deleteRFQUseCase({
        id: parseInt(id, 10),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteRFQAction');
      return createErrorResponse(error, res);
    }
  };
};
