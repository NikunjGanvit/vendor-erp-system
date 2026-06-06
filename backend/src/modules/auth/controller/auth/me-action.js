'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
}) {
  return async function meAction(req, res) {
    const logger = req.log;

    try {
      // req.user is set by authMiddleware
      return createSuccessResponse(200, { user: req.user }, res);
    } catch (error) {
      logger?.error(error, 'Error in meAction');
      return createErrorResponse(error, res);
    }
  };
};
