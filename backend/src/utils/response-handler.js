'use strict';

const response = require('./response');

module.exports = {
  success(res, data, message) {
    const payload = data !== undefined ? { ...data, message } : { message };
    return response.createSuccessResponse(200, payload, res);
  },

  badRequest(res, message) {
    return response.createErrorResponse({ statusCode: 400, message, name: 'ValidationError' }, res);
  },

  error(res, error) {
    return response.createErrorResponse(error, res);
  },
};
