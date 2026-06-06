'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  jwt,
  jwtSecret,
  jwtExpiresIn,
  ValidationError,
  AuthenticationError,
}) {
  return async function login({ email, password, logger }) {
    logger?.info({ email }, 'Login Use Case started');

    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error } = schema.validate({ email, password });
      if (error) {
        throw new ValidationError('Invalid input payload');
      }

      const user = await userDb.findForAuth({ email, logger });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password || '');
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      if (!user.is_active) {
        throw new AuthenticationError('User account is inactive');
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  };
};
