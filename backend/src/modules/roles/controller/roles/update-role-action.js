'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateRoleUseCase,
}) {
  return async function updateRoleAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedBy = req.user?.id || null;

      const role = await updateRoleUseCase({
        id: id ? Number(id) : null,
        roleData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, { role }, res);
    } catch (error) {
      logger?.error(error, 'Error in updateRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
