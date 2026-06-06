'use strict';
module.exports = function ({
  vendorItemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
}) {
  return async function updateVendorItem({ id, vendorItemData, updatedBy, logger }) {
    try {
      const schema = Joi.object({
        vendor_item_code: Joi.string().max(100).allow(null, ''),
        vendor_price: Joi.number().positive().precision(2),
        currency: Joi.string().length(3),
        min_order_quantity: Joi.number().integer().positive(),
        lead_time_days: Joi.number().integer().allow(null),
        discount_percentage: Joi.number().min(0).max(100),
        is_preferred_vendor: Joi.boolean(),
        is_active: Joi.boolean(),
      }).min(1);

      const { error, value } = schema.validate(vendorItemData, { abortEarly: false, stripUnknown: true });
      if (error) throw new ValidationError('Invalid update data');

      const transaction = await sequelize.transaction();
      try {
        await vendorItemDb.updateVendorItem({
          id,
          vendorItemData: { ...value, updated_by: updatedBy },
          transaction,
          logger,
        });
        await transaction.commit();
        return await vendorItemDb.findById({ id, logger });
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') await transaction.rollback();
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError('Failed to update vendor item');
    }
  };
};