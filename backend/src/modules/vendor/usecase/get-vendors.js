'use strict';

module.exports = function ({ vendorDb, buildFilterV2, buildSort, UnknownError }) {
  return async function getVendors({ query, logger }) {
    logger?.info({ query }, 'Get Vendors Use Case started');

    try {
      const schema = {
        vendor_code: 'string',
        name: 'string',
        gstin: 'string',
        email: 'string',
        phone: 'string',
        city: 'string',
        state: 'string',
        pincode: 'string',
        status: 'string',
        rating: 'number',
        payment_terms: 'string',
      };

      const filterObject = buildFilterV2({ schema, query });
      const sortObject = buildSort({ schema, query, defaultSort: 'id DESC' });

      const page = Number.parseInt(query.page, 10) || 1;
      const size = Number.parseInt(query.size, 10) || 20;
      const offset = (page - 1) * size;
      const limit = Math.min(Math.max(size, 1), 100);

      const result = await vendorDb.getVendors({
        filter: filterObject,
        sort: sortObject,
        pagination: { limit, offset },
        logger,
      });

      return {
        vendors: result.vendors,
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
      throw new UnknownError(err.message || 'Failed to fetch vendors');
    }
  };
};
