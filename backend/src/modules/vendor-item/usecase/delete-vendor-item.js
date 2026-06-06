'use strict';
module.exports = function ({ vendorItemDb, sequelize, UnknownError }) {
  return async function deleteVendorItem({ id, logger }) {
    try {
      const transaction = await sequelize.transaction();
      try {
        const result = await vendorItemDb.deleteVendorItem({ id, transaction, logger });
        await transaction.commit();
        return result;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') await transaction.rollback();
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      throw new UnknownError('Failed to delete vendor item');
    }
  };
};