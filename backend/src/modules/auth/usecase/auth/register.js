'use strict';

module.exports = function ({
  createUserUseCase,
  jwt,
  jwtSecret,
  jwtExpiresIn,
}) {
  return async function register({ userData, logger }) {
    logger?.info({ email: userData?.email }, 'Register Use Case started');

    // Reuse the create user usecase we previously developed
    const createdUser = await createUserUseCase({
      userData,
      createdBy: null, // Self registered users don't have a creator
      logger,
    });

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return {
      token,
      user: createdUser,
    };
  };
};
