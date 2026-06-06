'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getRFQByIdUseCase }) {
  return async function getRFQByIdAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const { withDetails = false } = req.query;

      const result = await getRFQByIdUseCase({
        id: parseInt(id, 10),
        withDetails: withDetails === 'true',
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getRFQByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
