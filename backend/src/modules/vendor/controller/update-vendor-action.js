'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, updateVendorUseCase }) {
  return async function updateVendorAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const vendorData = req.body;
      const updatedBy = req.user?.id || null;

      const result = await updateVendorUseCase({
        id,
        vendorData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in updateVendorAction');
      return createErrorResponse(error, res);
    }
  };
};
