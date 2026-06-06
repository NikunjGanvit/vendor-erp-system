'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, createVendorUseCase }) {
  return async function createVendorAction(req, res) {
    const logger = req.log;

    try {
      const vendorData = req.body;
      const createdBy = req.user?.id || null;

      const result = await createVendorUseCase({
        vendorData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger?.error(error, 'Error in createVendorAction');
      return createErrorResponse(error, res);
    }
  };
};
