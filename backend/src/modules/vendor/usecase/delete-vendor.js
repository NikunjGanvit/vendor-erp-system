'use strict';

module.exports = function ({ vendorDb, sequelize, NotFoundError, UnknownError }) {
  return async function deleteVendor({ id, logger }) {
    logger?.info({ id }, 'Delete Vendor Use Case started');

    try {
      const existingVendor = await vendorDb.getVendorById({ id, logger });
      if (!existingVendor) {
        throw new NotFoundError('Vendor not found');
      }

      const transaction = await sequelize.transaction();
      try {
        const deleted = await vendorDb.deleteVendorById({ id, transaction, logger });
        await transaction.commit();
        return deleted;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Vendor deletion failed');
    }
  };
};
