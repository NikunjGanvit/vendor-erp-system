'use strict';
const { buildFilterV2, buildSort } = require('eva-utilities');

module.exports = function ({ vendorItemDb, UnknownError }) {
  return async function getVendorItems({ query, logger }) {
    logger?.info({ query }, 'Get Vendor Items Use Case started');

    try {
      const schema = {
        vendor_id: 'number',
        item_id: 'number',
        vendor_item_code: 'string',
        vendor_price: 'number',
        currency: 'string',
        min_order_quantity: 'number',
        lead_time_days: 'number',
        discount_percentage: 'number',
        is_preferred_vendor: 'boolean',
        is_active: 'boolean',
      };

      const filterObject = buildFilterV2({ schema, query });
      const sortObject = buildSort({ schema, query, defaultSort: 'id DESC' });

      const page = Number.parseInt(query.page, 10) || 1;
      const size = Number.parseInt(query.size, 10) || 20;
      const offset = (page - 1) * size;
      const limit = Math.min(Math.max(size, 1), 100);

      const result = await vendorItemDb.getVendorItems({
        filter: filterObject,
        sort: sortObject,
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