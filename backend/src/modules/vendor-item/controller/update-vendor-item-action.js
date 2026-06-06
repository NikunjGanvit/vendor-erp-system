'use strict';
module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateVendorItemUseCase,
}) {
  return async function updateVendorItemAction(req, res) {
    const logger = req.log;
    try {
      const id = req.params.id;
      const vendorItemData = req.body;
      const updatedBy = req.user?.id || null;

      const result = await updateVendorItemUseCase({ id, vendorItemData, updatedBy, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in updateVendorItemAction');
      return createErrorResponse(error, res);
    }
  };
};