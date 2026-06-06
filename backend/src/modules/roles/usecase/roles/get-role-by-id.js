'use strict';

module.exports = function ({
  roleDb,
  NotFoundError,
  ValidationError,
  Joi,
}) {
  return async function getRoleById({ id, logger }) {
    logger?.info({ id }, 'getRoleById Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
      });

      const { error, value } = schema.validate({ id });
      if (error) {
        throw new ValidationError('Invalid Role ID format');
      }

      const role = await roleDb.findById({ id: value.id, logger });
      if (!role) {
        throw new NotFoundError('Role not found');
      }

      return role;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  };
};
