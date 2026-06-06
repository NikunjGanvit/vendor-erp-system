'use strict';
module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteVendorItemUseCase,
}) {
  return async function deleteVendorItemAction(req, res) {
    const logger = req.log;
    try {
      const id = req.params.id;
      const result = await deleteVendorItemUseCase({ id, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteVendorItemAction');
      return createErrorResponse(error, res);
    }
  };
};