'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
  NotFoundError,
}) {
  return async function updateUser({ id, userData, updatedBy, logger }) {
    logger?.info({ id, updatedFields: Object.keys(userData || {}) }, 'updateUser Use Case started');

    try {
      const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
        fullname: Joi.string().min(3).max(50).optional(),
        email: Joi.string().email().max(40).allow(null, '').optional(),
        phone_number: Joi.string().max(20).allow(null, '').optional(),
        is_active: Joi.boolean().optional(),
        meta_data: Joi.object().optional(),
        is_employee: Joi.boolean().optional(),
        role_id: Joi.number().integer().positive().allow(null).optional(),
        unit: Joi.string().length(2).allow(null, '').optional(),
        company_id: Joi.number().integer().positive().allow(null).optional(),
        employee_type: Joi.string().allow(null, '').optional(),
        employee_id: Joi.string().allow(null, '').optional(),
        designation: Joi.string().allow(null, '').optional(),
      });

      const { error, value } = schema.validate({ id, ...userData }, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid update input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const { id: validatedId, ...processedUser } = value;

      const existingUser = await userDb.findById({ id: validatedId, logger });
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // Duplicate Checks
      if (processedUser.email && processedUser.email !== existingUser.email) {
        const dup = await userDb.findByEmail({ email: processedUser.email, logger });
        if (dup && dup.id !== existingUser.id) {
          throw new ConflictError('Email already exists');
        }
      }

      if (processedUser.phone_number && processedUser.phone_number !== existingUser.phone_number) {
        const dup = await userDb.findByPhone({ phone_number: processedUser.phone_number, logger });
        if (dup && dup.id !== existingUser.id) {
          throw new ConflictError('Phone number already exists');
        }
      }

      if (processedUser.employee_id && processedUser.employee_id !== existingUser.employee_id) {
        const dup = await userDb.findByEmployeeId({ employee_id: processedUser.employee_id, logger });
        if (dup && dup.id !== existingUser.id) {
          throw new ConflictError('Employee ID already exists');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const updatedUser = await userDb.updateUser({
          id: validatedId,
          userData: {
            ...processedUser,
            updated_by: updatedBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: validatedId }, 'User updated successfully');
        return updatedUser;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back during update');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'User update failed');
    }
  };
};
