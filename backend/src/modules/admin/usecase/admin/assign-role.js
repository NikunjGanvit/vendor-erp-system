'use strict';

module.exports = function ({
  userDb,
  roleDb,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnknownError,
  sequelize,
  Joi,
}) {
  return async function assignRole({ userId, roleId, updatedBy, logger }) {
    logger?.info({ userId, roleId }, 'assignRole Use Case started');

    try {
      const schema = Joi.object({
        userId: Joi.number().integer().positive().required(),
        roleId: Joi.number().integer().positive().allow(null).required(),
      });

      const { error, value } = schema.validate({ userId, roleId });
      if (error) {
        throw new ValidationError('Invalid input parameters');
      }

      const existingUser = await userDb.findById({ id: value.userId, logger });
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      if (value.roleId !== null) {
        const existingRole = await roleDb.findById({ id: value.roleId, logger });
        if (!existingRole) {
          throw new NotFoundError('Role not found');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const updatedUser = await userDb.updateUser({
          id: value.userId,
          userData: {
            role_id: value.roleId,
            modified_by: updatedBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ userId: value.userId, roleId: value.roleId }, 'Role assigned successfully');
        return updatedUser;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Transaction failed during role assignment');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Role assignment failed');
    }
  };
};
