'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteRoleUseCase,
}) {
  return async function deleteRoleAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const result = await deleteRoleUseCase({
        id: id ? Number(id) : null,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
