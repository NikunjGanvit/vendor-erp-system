'use strict';

module.exports = function ({ vendorDb, Joi, sequelize, UnknownError, ValidationError, ConflictError }) {
  return async function createVendor({ vendorData, createdBy, logger }) {
    logger?.info({ vendorCode: vendorData?.vendor_code, name: vendorData?.name }, 'Create Vendor Use Case started');

    try {
      const schema = Joi.object({
        vendor_code: Joi.string().max(50).required(),
        name: Joi.string().max(255).required(),
        gstin: Joi.string().max(15).allow(null, '').optional(),
        email: Joi.string().email().required(),
        phone: Joi.string().max(20).allow(null, '').optional(),
        address: Joi.string().allow(null, '').optional(),
        city: Joi.string().max(100).allow(null, '').optional(),
        state: Joi.string().max(100).allow(null, '').optional(),
        pincode: Joi.string().max(10).allow(null, '').optional(),
        status: Joi.string().max(20).default('ACTIVE').optional(),
        rating: Joi.number().precision(2).min(0).default(0.0).optional(),
        payment_terms: Joi.string().max(100).allow(null, '').optional(),
      });

      const { error, value } = schema.validate(vendorData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details.map((d) => d.message) }, 'Joi validation failed for vendor creation');
        const err = new ValidationError('Invalid vendor input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedVendor = value;

      const existingByCode = await vendorDb.findByVendorCode({ vendor_code: normalizedVendor.vendor_code, logger });
      if (existingByCode) {
        throw new ConflictError('Vendor code already exists');
      }

      if (normalizedVendor.gstin) {
        const existingByGstin = await vendorDb.findByGstin({ gstin: normalizedVendor.gstin, logger });
        if (existingByGstin) {
          throw new ConflictError('GSTIN already exists');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const createdVendor = await vendorDb.createVendor({
          vendorData: {
            ...normalizedVendor,
            created_by: createdBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: createdVendor.id }, 'Vendor created successfully');
        return createdVendor;
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
      throw new UnknownError(err.message || 'Vendor creation failed');
    }
  };
};
