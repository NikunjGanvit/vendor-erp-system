'use strict';

module.exports = function ({ poDb, Joi, UnknownError }) {
  return async function getPOs({
    limit = 10,
    offset = 0,
    filter,
    sort,
    logger,
  }) {
    logger?.info({ limit, offset, filter, sort }, 'Get POs Use Case started');

    try {
      const schema = Joi.object({
        limit: Joi.number().min(1).max(100).default(10),
        offset: Joi.number().min(0).default(0),
        filter: Joi.alternatives().try(
          Joi.string(),
          Joi.array(),
          Joi.object()
        ).optional(),
        sort: Joi.alternatives().try(
          Joi.string(),
          Joi.array(),
          Joi.object()
        ).optional(),
      });

      const { error, value } = schema.validate(
        { limit, offset, filter, sort },
        { stripUnknown: true }
      );

      if (error) {
        logger?.warn({ validationErrors: error.details }, 'Validation failed');
        throw new UnknownError('Invalid query parameters');
      }

      const result = await poDb.getPOs({
        limit: value.limit,
        offset: value.offset,
        filter: value.filter,
        sort: value.sort,
        logger,
      });

      logger?.info({ count: result.data.length }, 'POs retrieved successfully');
      return result;
    } catch (error) {
      logger?.error(error, 'Error in getPOs usecase');
      throw error;
    }
  };
};
