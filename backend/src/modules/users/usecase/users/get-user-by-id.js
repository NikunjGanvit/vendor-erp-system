'use strict';

module.exports = function ({
  userDb,
  NotFoundError,
  ValidationError,
  Joi,
}) {
  return async function getUserById({ id, logger }) {
    logger?.info({ id }, 'getUserById Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
      });

      const { error, value } = schema.validate({ id });
      if (error) {
        throw new ValidationError('Invalid User ID format');
      }

      const user = await userDb.findById({ id: value.id, logger });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  };
};
