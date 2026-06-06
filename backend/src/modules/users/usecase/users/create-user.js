'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createUser({ userData, createdBy, logger }) {
    logger?.info({
      fullname: userData?.fullname,
      email: userData?.email,
      role: userData?.role,
    }, 'Create User Use Case started');

    try {
      const schema = Joi.object({
        fullname: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().max(40).allow(null, '').optional(),
        password: Joi.string().min(6).max(100).allow(null, '').optional(),
        phone_number: Joi.string().max(20).allow(null, '').optional(),
        is_active: Joi.boolean().default(false).optional(),
        meta_data: Joi.object().default({}).optional(),
        is_employee: Joi.boolean().default(false).optional(),
        role: Joi.string().max(20).default('USER').optional(),
        unit: Joi.string().length(2).allow(null, '').optional(),
        company_id: Joi.number().integer().positive().allow(null).optional(),
        employee_type: Joi.string().allow(null, '').optional(),
        employee_id: Joi.string().allow(null, '').optional(),
        designation: Joi.string().allow(null, '').optional(),
      });

      const { error, value } = schema.validate(userData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn({ validationErrors: error.details.map((d) => d.message) }, 'Joi validation failed for user creation');
        const err = new ValidationError('Invalid user input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const processedUser = value;

      // Duplicate Checks
      if (processedUser.email) {
        const existingEmail = await userDb.findByEmail({ email: processedUser.email, logger });
        if (existingEmail) {
          throw new ConflictError('Email already exists');
        }
      }

      if (processedUser.phone_number) {
        const existingPhone = await userDb.findByPhone({ phone_number: processedUser.phone_number, logger });
        if (existingPhone) {
          throw new ConflictError('Phone number already exists');
        }
      }

      if (processedUser.employee_id) {
        const existingEmpId = await userDb.findByEmployeeId({ employee_id: processedUser.employee_id, logger });
        if (existingEmpId) {
          throw new ConflictError('Employee ID already exists');
        }
      }

      // Password Hashing
      if (processedUser.password) {
        try {
          processedUser.password = await bcrypt.hash(processedUser.password, 10);
        } catch (err) {
          logger?.error(err);
          throw new UnknownError('Failed to process password');
        }
      }

      const transaction = await sequelize.transaction();
      try {
        const createdUser = await userDb.createUser({
          userData: {
            ...processedUser,
            created_by: createdBy,
          },
          transaction,
          logger,
        });

        await transaction.commit();
        logger?.info({ id: createdUser.id }, 'User created successfully');
        return createdUser;
      } catch (err) {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        logger?.error({ err: err.message }, 'Database transaction rolled back due to error');
        throw err;
      }
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) {
        throw err;
      }
      throw new UnknownError(err.message || 'User creation failed');
    }
  };
};
