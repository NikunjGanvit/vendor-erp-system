'use strict';

module.exports = function ({ rfqDb, Joi, NotFoundError, ValidationError }) {
  return async function updateRFQ({ id, updateData, logger }) {
    logger?.info({ id }, 'Update RFQ Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
        updateData: Joi.object({
          title: Joi.string().max(255).optional(),
          status: Joi.string()
            .valid('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED')
            .optional(),
          deadline: Joi.date().optional(),
          notes: Joi.string().allow(null, '').optional(),
          total_estimated_amount: Joi.number().precision(2).optional(),
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

      // Check if RFQ exists
      const existingRFQ = await rfqDb.getRFQById({ id: value.id, logger });
      if (!existingRFQ) {
        throw new NotFoundError('RFQ not found');
      }

      const result = await rfqDb.updateRFQById({
        id: value.id,
        updateData: value.updateData,
        logger,
      });

      logger?.info({ id: value.id }, 'RFQ updated successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in updateRFQ usecase');
      throw error;
    }
  };
};
