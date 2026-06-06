'use strict';
module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getVendorItemsUseCase,
}) {
  return async function getVendorItemsAction(req, res) {
    const logger = req.log;
    try {
      const query = req.query;
      const result = await getVendorItemsUseCase({ query, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getVendorItemsAction');
      return createErrorResponse(error, res);
    }
  };
};