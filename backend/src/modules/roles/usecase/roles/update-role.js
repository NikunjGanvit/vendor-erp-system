'use strict';

module.exports = function ({
  roleDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
}) {
  return async function updateRole({ id, roleData, updatedBy, logger }) {
    logger?.info({ id, updatedFields: Object.keys(roleData || {}) }, 'updateRole Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
        role: Joi.string().min(2).max(50).optional(),
        is_active: Joi.boolean().optional(),
      });

      const { error, value } = schema.validate({ id, ...roleData }, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid role update payload');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const { id: validatedId, ...processedData } = value;

      const existing = await roleDb.findById({ id: validatedId, logger });
      if (!existing) {
        throw new NotFoundError('Role not found');
      }

      if (processedData.role && processedData.role.toLowerCase() !== existing.role.toLowerCase()) {
        const dup = await roleDb.findByRoleName({ roleName: processedData.role, logger });
        if (dup && dup.id !== existing.id) {
          throw new ConflictError('Role name already exists');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const updated = await roleDb.updateRole({
          id: validatedId,
          roleData: {
            ...processedData,
            updated_by: updatedBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: validatedId }, 'Role updated successfully');
        return updated;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back during role update');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Role update failed');
    }
  };
};
