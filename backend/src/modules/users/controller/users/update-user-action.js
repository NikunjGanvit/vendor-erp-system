'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateUserUseCase,
}) {
  return async function updateUserAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedBy = req.user?.id || null;

      const user = await updateUserUseCase({
        id: id ? Number(id) : null,
        userData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, { user }, res);
    } catch (error) {
      logger?.error(error, 'Error in updateUserAction');
      return createErrorResponse(error, res);
    }
  };
};
