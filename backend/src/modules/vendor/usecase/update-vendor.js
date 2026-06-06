'use strict';

module.exports = function ({ vendorDb, Joi, sequelize, UnknownError, ValidationError, ConflictError, NotFoundError }) {
  return async function updateVendor({ id, vendorData, updatedBy, logger }) {
    logger?.info({ id, vendorData }, 'Update Vendor Use Case started');

    try {
      const schema = Joi.object({
        vendor_code: Joi.string().max(50).optional(),
        name: Joi.string().max(255).optional(),
        gstin: Joi.string().max(15).allow(null, '').optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().max(20).allow(null, '').optional(),
        address: Joi.string().allow(null, '').optional(),
        city: Joi.string().max(100).allow(null, '').optional(),
        state: Joi.string().max(100).allow(null, '').optional(),
        pincode: Joi.string().max(10).allow(null, '').optional(),
        status: Joi.string().max(20).optional(),
        rating: Joi.number().precision(2).min(0).optional(),
        payment_terms: Joi.string().max(100).allow(null, '').optional(),
      }).min(1);

      const { error, value } = schema.validate(vendorData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details.map((d) => d.message) }, 'Joi validation failed for vendor update');
        const err = new ValidationError('Invalid vendor update input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedVendor = value;
      const existingVendor = await vendorDb.getVendorById({ id, logger });
      if (!existingVendor) {
        throw new NotFoundError('Vendor not found');
      }

      if (normalizedVendor.vendor_code && normalizedVendor.vendor_code !== existingVendor.vendor_code) {
        const vendorByCode = await vendorDb.findByVendorCode({ vendor_code: normalizedVendor.vendor_code, logger });
        if (vendorByCode) {
          throw new ConflictError('Vendor code already exists');
        }
      }

      if (normalizedVendor.gstin && normalizedVendor.gstin !== existingVendor.gstin) {
        const vendorByGstin = await vendorDb.findByGstin({ gstin: normalizedVendor.gstin, logger });
        if (vendorByGstin) {
          throw new ConflictError('GSTIN already exists');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const updatedVendor = await vendorDb.updateVendorById({
          id,
          vendorData: normalizedVendor,
          updatedBy,
          transaction,
          logger,
        });

        await transaction.commit();
        return updatedVendor;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back due to error');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Vendor update failed');
    }
  };
};
