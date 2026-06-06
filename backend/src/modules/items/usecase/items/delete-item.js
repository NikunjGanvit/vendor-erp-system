'use strict';

module.exports = function ({
  itemDb,
  NotFoundError,
  UnknownError,
}) {
  return async function deleteItem({ id, deletedBy, logger }) {
    logger?.info({ id }, 'Delete Item Use Case started');

    try {
      const existingItem = await itemDb.getItemById({ id, logger });
      if (!existingItem) {
        throw new NotFoundError('Item not found');
      }

      const deletedItem = await itemDb.deleteItemById({ id, deletedBy, logger });
      return deletedItem;
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Item deletion failed');
    }
  };
};
