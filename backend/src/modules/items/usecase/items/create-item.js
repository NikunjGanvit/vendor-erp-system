'use strict';

module.exports = function ({
  itemDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createItem({ itemData, createdBy, logger }) {
    logger?.info({ itemCode: itemData?.item_code, name: itemData?.name }, 'Create Item Use Case started');

    try {
      const schema = Joi.object({
        item_code: Joi.string().max(50).required(),
        name: Joi.string().max(255).required(),
        description: Joi.string().allow(null, '').optional(),
        internal_uom: Joi.string().max(50).required(),
        purchase_uom: Joi.string().max(50).required(),
        conversion_factor: Joi.number().precision(6).positive().default(1.0).optional(),
        category: Joi.string().max(100).allow(null, '').optional(),
        sub_category: Joi.string().max(100).allow(null, '').optional(),
        hsn_code: Joi.string().max(20).allow(null, '').optional(),
        gst_rate: Joi.number().min(0).max(100).default(18.0).optional(),
        base_price: Joi.number().precision(2).min(0).allow(null).optional(),
        is_active: Joi.boolean().default(true).optional(),
        is_service: Joi.boolean().default(false).optional(),
      });

      const { error, value } = schema.validate(itemData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details.map((d) => d.message) }, 'Joi validation failed for item creation');
        const err = new ValidationError('Invalid item input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedItem = value;

      const existingItem = await itemDb.findByItemCode({ item_code: normalizedItem.item_code, logger });
      if (existingItem) {
        throw new ConflictError('Item code already exists');
      }

      const transaction = await sequelize.transaction();
      try {
        const createdItem = await itemDb.createItem({
          itemData: {
            ...normalizedItem,
            created_by: createdBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: createdItem.id }, 'Item created successfully');
        return createdItem;
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
      throw new UnknownError(err.message || 'Item creation failed');
    }
  };
};
