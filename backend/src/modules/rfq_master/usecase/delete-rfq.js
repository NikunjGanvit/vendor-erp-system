'use strict';

module.exports = function ({ rfqDb, Joi, NotFoundError, ValidationError }) {
  return async function deleteRFQ({ id, logger }) {
    logger?.info({ id }, 'Delete RFQ Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ id }, { stripUnknown: true });

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new ValidationError('Invalid RFQ ID');
      }

      // Check if RFQ exists
      const existingRFQ = await rfqDb.getRFQById({ id: value.id, logger });
      if (!existingRFQ) {
        throw new NotFoundError('RFQ not found');
      }

      const result = await rfqDb.deleteRFQById({ id: value.id, logger });

      logger?.info({ id: value.id }, 'RFQ deleted successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in deleteRFQ usecase');
      throw error;
    }
  };
};
