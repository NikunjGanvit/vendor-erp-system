'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, createPOUseCase }) {
  return async function createPOAction(req, res) {
    const logger = req.log;

    try {
      const poData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createPOUseCase({
        poData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createPOAction');
      return createErrorResponse(error, res);
    }
  };
};
