'use strict';

module.exports = function ({
  roleDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createRole({ roleData, createdBy, logger }) {
    logger?.info({ role: roleData?.role }, 'createRole Use Case started');

    try {
      const schema = Joi.object({
        role: Joi.string().min(2).max(50).required(),
        is_active: Joi.boolean().optional().default(true),
      });

      const { error, value } = schema.validate(roleData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid role payload');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      // Check duplicate role name
      const existing = await roleDb.findByRoleName({ roleName: value.role, logger });
      if (existing) {
        throw new ConflictError('Role already exists');
      }

      const transaction = await sequelize.transaction();
      try {
        const created = await roleDb.createRole({
          roleData: {
            ...value,
            created_by: createdBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: created.id }, 'Role created successfully');
        return created;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back during role creation');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'Role creation failed');
    }
  };
};
