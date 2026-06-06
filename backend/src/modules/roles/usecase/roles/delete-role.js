'use strict';

module.exports = function ({
  roleDb,
  userDb,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnknownError,
  sequelize,
  Joi,
}) {
  return async function deleteRole({ id, logger }) {
    logger?.info({ id }, 'deleteRole Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
      });

      const { error, value } = schema.validate({ id });
      if (error) {
        throw new ValidationError('Invalid Role ID format');
      }

      const existing = await roleDb.findById({ id: value.id, logger });
      if (!existing) {
        throw new NotFoundError('Role not found');
      }

      // Check if any active user is assigned to this role
      const assignedUsers = await userDb.listUsers({
        filters: [{ field: 'role_id', operator: 'number equals', value: value.id }],
        limit: 1,
        logger,
      });

      if (assignedUsers.total > 0) {
        throw new ConflictError('Cannot delete role as it is assigned to one or more users');
      }

      const transaction = await sequelize.transaction();
      try {
        await roleDb.deleteRole({ id: value.id, transaction, logger });
        await transaction.commit();
        logger?.info({ id: value.id }, 'Role deleted successfully');
        return { message: 'Role deleted successfully' };
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Role deletion failed');
    }
  };
};
