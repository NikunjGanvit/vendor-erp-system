'use strict';

module.exports = function ({
  itemDb,
  NotFoundError,
  UnknownError,
}) {
  return async function getItems({ query, logger }) {
    logger?.info({ query }, 'Get Items Use Case started');

    try {
      const filters = query.filters ?? query.filter;
      const sort = query.sort;

      const page = Number.parseInt(query.page, 10) || 1;
      const size = Number.parseInt(query.size, 10) || 20;
      const offset = (page - 1) * size;
      const limit = Math.min(Math.max(size, 1), 100);

      const result = await itemDb.getItems({
        filters,
        sort,
        pagination: { limit, offset },
        logger,
      });

      return {
        items: result.items,
        meta: {
          page,
          size: limit,
          total: result.total,
        },
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Failed to fetch items');
    }
  };
};
