'use strict';

module.exports = function ({
  userDb,
  NotFoundError,
  ValidationError,
  UnknownError,
  sequelize,
  Joi,
}) {
  return async function deleteUser({ id, logger }) {
    logger?.info({ id }, 'deleteUser Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
      });

      const { error, value } = schema.validate({ id });
      if (error) {
        throw new ValidationError('Invalid User ID format');
      }

      const existingUser = await userDb.findById({ id: value.id, logger });
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      const transaction = await sequelize.transaction();
      try {
        await userDb.deleteUser({ id: value.id, transaction, logger });
        await transaction.commit();
        logger?.info({ id: value.id }, 'User soft-deleted successfully');
        return { message: 'User soft-deleted successfully' };
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back during delete');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'User deletion failed');
    }
  };
};
