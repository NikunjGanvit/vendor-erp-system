'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getVendorsUseCase }) {
  return async function getVendorsAction(req, res) {
    const logger = req.log;

    try {
      const query = req.query;
      const result = await getVendorsUseCase({ query, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getVendorsAction');
      return createErrorResponse(error, res);
    }
  };
};
