'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getPOByIdUseCase }) {
  return async function getPOByIdAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const { withDetails = false } = req.query;

      const result = await getPOByIdUseCase({
        id: parseInt(id, 10),
        withDetails: withDetails === 'true',
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getPOByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
