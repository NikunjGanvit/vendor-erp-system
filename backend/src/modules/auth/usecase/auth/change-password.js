'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  UnknownError,
}) {
  return async function changePassword({ email, oldPassword, newPassword, logger }) {
    logger?.info({ email }, 'Change Password Use Case started');

    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).max(100).required(),
      });

      const { error } = schema.validate({ email, oldPassword, newPassword });
      if (error) {
        throw new ValidationError('Invalid inputs for change password');
      }

      // Fetch user with password
      const user = await userDb.findForAuth({ email, logger });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Compare old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password || '');
      if (!isOldPasswordValid) {
        throw new AuthenticationError('Incorrect current password');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Save user password
      await userDb.updateUser({
        id: user.id,
        userData: {
          password: hashedNewPassword,
        },
        logger,
      });

      logger?.info({ userId: user.id }, 'Password updated successfully');
      return { success: true };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  };
};
