'use strict';

module.exports = function ({
  itemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
}) {
  return async function updateItem({ id, itemData, updatedBy, logger }) {
    logger?.info({ id, itemData }, 'Update Item Use Case started');

    try {
      const schema = Joi.object({
        item_code: Joi.string().max(50).optional(),
        name: Joi.string().max(255).optional(),
        description: Joi.string().allow(null, '').optional(),
        internal_uom: Joi.string().max(50).optional(),
        purchase_uom: Joi.string().max(50).optional(),
        conversion_factor: Joi.number().precision(6).positive().optional(),
        category: Joi.string().max(100).allow(null, '').optional(),
        sub_category: Joi.string().max(100).allow(null, '').optional(),
        hsn_code: Joi.string().max(20).allow(null, '').optional(),
        gst_rate: Joi.number().min(0).max(100).optional(),
        base_price: Joi.number().precision(2).min(0).allow(null).optional(),
        is_active: Joi.boolean().optional(),
        is_service: Joi.boolean().optional(),
      });

      const { error, value } = schema.validate(itemData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details.map((d) => d.message) }, 'Joi validation failed for item update');
        const err = new ValidationError('Invalid item update input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedItem = value;
      const existingById = await itemDb.getItemById({ id, logger });
      if (!existingById) {
        throw new NotFoundError('Item not found');
      }

      if (normalizedItem.item_code && normalizedItem.item_code !== existingById.item_code) {
        const existingItem = await itemDb.findByItemCode({ item_code: normalizedItem.item_code, logger });
        if (existingItem) {
          throw new ConflictError('Item code already exists');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const updatedItem = await itemDb.updateItemById({
          id,
          itemData: normalizedItem,
          updatedBy,
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id }, 'Item updated successfully');
        return updatedItem;
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
      throw new UnknownError(err.message || 'Item update failed');
    }
  };
};
