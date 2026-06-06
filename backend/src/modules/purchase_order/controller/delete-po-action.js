'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, deletePOUseCase }) {
  return async function deletePOAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const result = await deletePOUseCase({
        id: parseInt(id, 10),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deletePOAction');
      return createErrorResponse(error, res);
    }
  };
};
