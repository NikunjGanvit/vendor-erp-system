'use strict';

module.exports = function ({ createErrorResponse, createSuccessResponse, getRFQsUseCase }) {
  return async function getRFQsAction(req, res) {
    const logger = req.log;

    try {
      const { limit, offset, filter, sort } = req.query;

      const result = await getRFQsUseCase({
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0,
        filter: filter || null,
        sort: sort || null,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in getRFQsAction');
      return createErrorResponse(error, res);
    }
  };
};
