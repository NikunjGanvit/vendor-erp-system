'use strict';
module.exports = function ({
  vendorItemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createVendorItem({ vendorItemData, createdBy, logger }) {
    logger?.info({ vendorId: vendorItemData?.vendor_id, itemId: vendorItemData?.item_id }, 'Create Vendor Item started');

    try {
      const schema = Joi.object({
        vendor_id: Joi.number().integer().positive().required(),
        item_id: Joi.number().integer().positive().required(),
        vendor_item_code: Joi.string().max(100).allow(null, ''),
        vendor_price: Joi.number().positive().required(),
        currency: Joi.string().length(3).default('INR'),
        min_order_quantity: Joi.number().integer().positive().default(1),
        lead_time_days: Joi.number().integer().allow(null),
        discount_percentage: Joi.number().min(0).max(100).default(0),
        is_preferred_vendor: Joi.boolean().default(false),
        is_active: Joi.boolean().default(true),
      });

      const { error, value } = schema.validate(vendorItemData, { abortEarly: false, stripUnknown: true });
      if (error) {
        const err = new ValidationError('Invalid vendor item input');
        err.details = error.details;
        throw err;
      }

      // Check duplicate vendor-item combination
      const existing = await vendorItemDb.findByVendorAndItem({
        vendor_id: value.vendor_id,
        item_id: value.item_id,
        logger,
      });
      if (existing) throw new ConflictError('This vendor already has this item');

      const transaction = await sequelize.transaction();
      try {
        const created = await vendorItemDb.createVendorItem({
          vendorItemData: { ...value, created_by: createdBy },
          transaction,
          logger,
        });
        await transaction.commit();
        return created;
      } catch (err) {
        if (transaction && !transaction.finished) await transaction.rollback();
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to create vendor item');
    }
  };
};