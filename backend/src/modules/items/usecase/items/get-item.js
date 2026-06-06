'use strict';

module.exports = function ({
  itemDb,
  NotFoundError,
  UnknownError,
}) {
  return async function getItem({ id, logger }) {
    logger?.info({ id }, 'Get Item Use Case started');

    try {
      const item = await itemDb.getItemById({ id, logger });
      if (!item) {
        throw new NotFoundError('Item not found');
      }
      return item;
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Failed to fetch item');
    }
  };
};
