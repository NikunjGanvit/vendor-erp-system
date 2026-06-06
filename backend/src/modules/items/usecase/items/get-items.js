'use strict';

module.exports = function ({
  itemDb,
  buildFilterV2,
  buildSort,
  NotFoundError,
  UnknownError,
}) {
  return async function getItems({ query, logger }) {
    logger?.info({ query }, 'Get Items Use Case started');

    try {
      const schema = {
        item_code: 'string',
        name: 'string',
        category: 'string',
        sub_category: 'string',
        internal_uom: 'string',
        purchase_uom: 'string',
        is_active: 'boolean',
        is_service: 'boolean',
        hsn_code: 'string',
      };

      const filterObject = buildFilterV2({ schema, query });
      const sortObject = buildSort({ schema, query, defaultSort: 'id DESC' });

      const page = Number.parseInt(query.page, 10) || 1;
      const size = Number.parseInt(query.size, 10) || 20;
      const offset = (page - 1) * size;
      const limit = Math.min(Math.max(size, 1), 100);

      const result = await itemDb.getItems({
        filter: filterObject,
        sort: sortObject,
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
