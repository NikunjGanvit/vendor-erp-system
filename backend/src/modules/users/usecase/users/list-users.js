'use strict';

module.exports = function ({
  userDb,
  ValidationError,
  Joi,
}) {
  return async function listUsers({ searchParams, logger }) {
    logger?.info({ searchParams }, 'listUsers Use Case started');

    try {
      const schema = Joi.object({
        filters: Joi.array().optional().default([]),
        sort: Joi.array().optional().default([]),
        globalSearch: Joi.string().allow('', null).optional().default(''),
        page: Joi.number().integer().positive().optional().default(1),
        limit: Joi.number().integer().positive().max(100).optional().default(10),
      });

      const { error, value } = schema.validate(searchParams, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid search payload');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const { filters, sort, globalSearch, page, limit } = value;

      const { rows, total } = await userDb.listUsers({
        filters,
        sort,
        globalSearch,
        page,
        limit,
        logger,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
        users: rows,
      };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  };
};
