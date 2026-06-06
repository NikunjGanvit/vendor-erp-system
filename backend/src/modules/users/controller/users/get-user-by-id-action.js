'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getUserByIdUseCase,
}) {
  return async function getUserByIdAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const user = await getUserByIdUseCase({
        id: id ? Number(id) : null,
        logger,
      });

      return createSuccessResponse(200, { user }, res);
    } catch (error) {
      logger?.error(error, 'Error in getUserByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
