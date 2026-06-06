'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getPOsUseCase }) {
  return async function getPOsAction(req, res) {
    const logger = req.log;

    try {
      const { limit, offset, filter, sort } = req.query;

      const result = await getPOsUseCase({
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0,
        filter: filter || null,
        sort: sort || null,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getPOsAction');
      return createErrorResponse(error, res);
    }
  };
};
