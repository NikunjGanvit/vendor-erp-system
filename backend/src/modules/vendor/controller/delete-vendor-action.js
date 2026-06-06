'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, deleteVendorUseCase }) {
  return async function deleteVendorAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const result = await deleteVendorUseCase({ id, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteVendorAction');
      return createErrorResponse(error, res);
    }
  };
};
