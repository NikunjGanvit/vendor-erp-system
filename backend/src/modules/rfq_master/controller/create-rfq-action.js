'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, createRFQUseCase }) {
  return async function createRFQAction(req, res) {
    const logger = req.log;

    try {
      const rfqData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createRFQUseCase({
        rfqData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createRFQAction');
      return createErrorResponse(error, res);
    }
  };
};
