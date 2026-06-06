'use strict';

module.exports = function ({ poDb, Joi, NotFoundError, ValidationError }) {
  return async function deletePO({ id, logger }) {
    logger?.info({ id }, 'Delete PO Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ id }, { stripUnknown: true });

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new ValidationError('Invalid PO ID');
      }

      // Check if PO exists
      const existingPO = await poDb.getPOById({ id: value.id, logger });
      if (!existingPO) {
        throw new NotFoundError('PO not found');
      }

      const result = await poDb.deletePOById({ id: value.id, logger });

      logger?.info({ id: value.id }, 'PO deleted successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in deletePO usecase');
      throw error;
    }
  };
};
