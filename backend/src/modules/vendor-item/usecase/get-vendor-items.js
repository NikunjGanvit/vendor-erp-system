'use strict';

module.exports = function ({ vendorItemDb, UnknownError }) {
  return async function getVendorItems({ query, logger }) {
    logger?.info({ query }, 'Get Vendor Items Use Case started');

    try {
      const filters = query.filters ?? query.filter;
      const sort = query.sort;

      const page = Number.parseInt(query.page, 10) || 1;
      const size = Number.parseInt(query.size, 10) || 20;
      const offset = (page - 1) * size;
      const limit = Math.min(Math.max(size, 1), 100);

      const result = await vendorItemDb.getVendorItems({
        filters,
        sort,
        pagination: { limit, offset },
        logger,
      });

      return {
        vendorItems: result.items,
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
      throw new UnknownError(err.message || 'Failed to fetch vendor items');
    }
  };
};