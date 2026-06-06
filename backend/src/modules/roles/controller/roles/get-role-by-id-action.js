'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getRoleByIdUseCase,
}) {
  return async function getRoleByIdAction(req, res) {
    const logger = req.log;

    try {
      const { id } = req.params;

      const role = await getRoleByIdUseCase({
        id: id ? Number(id) : null,
        logger,
      });

      return createSuccessResponse(200, { role }, res);
    } catch (error) {
      logger?.error(error, 'Error in getRoleByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
