'use strict';
module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createVendorItemUseCase,
}) {
  return async function createVendorItemAction(req, res) {
    const logger = req.log;
    try {
      const vendorItemData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createVendorItemUseCase({
        vendorItemData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createVendorItemAction');
      return createErrorResponse(error, res);
    }
  };
};