'use strict';
module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getVendorItemByIdUseCase,
}) {
  return async function getVendorItemByIdAction(req, res) {
    const logger = req.log;
    try {
      const id = req.params.id;
      const result = await getVendorItemByIdUseCase({ id, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getVendorItemByIdAction');
      return createErrorResponse(error, res);
    }
  };
};