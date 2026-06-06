'use strict';

module.exports = function ({ rfqDb, Joi, NotFoundError, ValidationError }) {
  return async function getRFQById({ id, withDetails = false, logger }) {
    logger?.info({ id, withDetails }, 'Get RFQ By ID Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ id }, { stripUnknown: true });

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new ValidationError('Invalid RFQ ID');
      }

      const result = withDetails
        ? await rfqDb.getRFQWithDetails({ id: value.id, logger })
        : await rfqDb.getRFQById({ id: value.id, logger });

      if (!result) {
        throw new NotFoundError('RFQ not found');
      }

      logger?.info({ id: value.id }, 'RFQ retrieved successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in getRFQById usecase');
      throw error;
    }
  };
};
