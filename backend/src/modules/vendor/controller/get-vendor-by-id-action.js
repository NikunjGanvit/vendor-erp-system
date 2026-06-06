'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getVendorByIdUseCase }) {
  return async function getVendorByIdAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const result = await getVendorByIdUseCase({ id, logger });
      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getVendorByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
