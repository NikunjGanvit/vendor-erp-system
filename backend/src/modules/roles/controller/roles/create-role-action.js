'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createRoleUseCase,
}) {
  return async function createRoleAction(req, res) {
    const logger = req.log;

    try {
      const roleData = req.body;
      const createdBy = req.user?.id || null;

      const role = await createRoleUseCase({
        roleData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, { role }, res);
    } catch (error) {
      logger?.error(error, 'Error in createRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
