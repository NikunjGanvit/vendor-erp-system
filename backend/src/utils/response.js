'use strict';

const createSuccessResponse = (statusCode, data, res) => {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: res?.req?.id || null,
  };

  if (res && typeof res.status === 'function') {
    res.status(statusCode).json(response);
  }
  return response;
};

const createErrorResponse = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error using request child logger if available, else standard console
  if (res?.req?.log) {
    res.req.log.error({ err: error, statusCode }, message);
  }

  const response = {
    success: false,
    error: {
      message,
      code: error.name || 'UNKNOWN_ERROR',
    },
    timestamp: new Date().toISOString(),
    requestId: res?.req?.id || null,
  };

  if (error.details) {
    response.error.details = error.details;
  }

  if (res && typeof res.status === 'function') {
    res.status(statusCode).json(response);
  }
  return response;
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
};
