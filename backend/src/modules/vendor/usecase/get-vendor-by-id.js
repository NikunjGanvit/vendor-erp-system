'use strict';

module.exports = function ({ vendorDb, NotFoundError, UnknownError }) {
  return async function getVendorById({ id, logger }) {
    try {
      const result = await vendorDb.getVendorById({ id, logger });
      if (!result) {
        throw new NotFoundError('Vendor not found');
      }
      return result;
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Failed to fetch vendor');
    }
  };
};
