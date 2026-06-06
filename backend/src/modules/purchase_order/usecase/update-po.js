'use strict';

module.exports = function ({ poDb, Joi, NotFoundError, ValidationError }) {
  return async function updatePO({ id, updateData, logger }) {
    logger?.info({ id }, 'Update PO Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
        updateData: Joi.object({
          status: Joi.string()
            .valid('DRAFT', 'APPROVED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED', 'CLOSED')
            .optional(),
          approval_status: Joi.string()
            .valid('PENDING', 'APPROVED', 'REJECTED')
            .optional(),
          delivery_date: Joi.date().optional(),
          total_amount: Joi.number().precision(2).optional(),
          tax_amount: Joi.number().precision(2).optional(),
          grand_total: Joi.number().precision(2).optional(),
          notes: Joi.string().allow(null, '').optional(),
        })
        .min(1)
        .required(),
      });

      const { error, value } = schema.validate({ id, updateData }, {
        stripUnknown: true,
        abortEarly: false,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new ValidationError('Invalid input');
      }

      // Check if PO exists
      const existingPO = await poDb.getPOById({ id: value.id, logger });
      if (!existingPO) {
        throw new NotFoundError('PO not found');
      }

      const result = await poDb.updatePOById({
        id: value.id,
        updateData: value.updateData,
        logger,
      });

      logger?.info({ id: value.id }, 'PO updated successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in updatePO usecase');
      throw error;
    }
  };
};
