'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  assignRoleUseCase,
}) {
  return async function assignRoleAction(req, res) {
    const logger = req.log;

    try {
      const { userId, roleId } = req.body;
      const updatedBy = req.user?.id || null;

      const user = await assignRoleUseCase({
        userId: userId ? Number(userId) : null,
        roleId: (roleId === null || roleId === undefined) ? null : Number(roleId),
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, { user }, res);
    } catch (error) {
      logger?.error(error, 'Error in assignRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
