'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteUserUseCase,
}) {
  return async function deleteUserAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const result = await deleteUserUseCase({
        id: id ? Number(id) : null,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger?.error(error, 'Error in deleteUserAction');
      return createErrorResponse(error, res);
    }
  };
};
