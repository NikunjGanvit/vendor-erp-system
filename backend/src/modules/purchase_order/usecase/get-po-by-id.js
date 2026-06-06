'use strict';

module.exports = function ({ poDb, Joi, NotFoundError, ValidationError }) {
  return async function getPOById({ id, withDetails = false, logger }) {
    logger?.info({ id, withDetails }, 'Get PO By ID Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ id }, { stripUnknown: true });

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new ValidationError('Invalid PO ID');
      }

      const result = withDetails
        ? await poDb.getPOWithDetails({ id: value.id, logger })
        : await poDb.getPOById({ id: value.id, logger });

      if (!result) {
        throw new NotFoundError('PO not found');
      }

      logger?.info({ id: value.id }, 'PO retrieved successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in getPOById usecase');
      throw error;
    }
  };
};
