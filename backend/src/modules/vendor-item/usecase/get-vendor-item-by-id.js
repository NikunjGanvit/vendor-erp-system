'use strict';
module.exports = function ({ vendorItemDb, UnknownError }) {
  return async function getVendorItemById({ id, logger }) {
    try {
      const result = await vendorItemDb.findById({ id, logger });
      if (!result) throw new Error('Vendor Item not found'); // Will be caught as 404 in error handler
      return result;
    } catch (err) {
      logger?.error(err);
      throw new UnknownError('Failed to fetch vendor item');
    }
  };
};