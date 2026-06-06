'use strict';

const pino = require('pino');

// ─── Configuration ───────────────────────────────────────────────────
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug');
const isDev = NODE_ENV !== 'production';

// ─── Custom Serializers ─────────────────────────────────────────────
const serializers = {
  req(req) {
    return {
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      remoteAddress: req.remoteAddress || req.ip,
      ...(req.headers?.['user-agent'] && { userAgent: req.headers['user-agent'] }),
    };
  },

  res(res) {
    return {
      statusCode: res.statusCode,
    };
  },

  err: pino.stdSerializers.err,
};

// ─── Pretty Transport (Development) ─────────────────────────────────
const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname',
    messageFormat: '{msg}',
    singleLine: false,
  },
};

// ─── Logger Instance ─────────────────────────────────────────────────
const logger = pino({
  level: LOG_LEVEL,
  serializers,
  ...(isDev
    ? { transport: devTransport }
    : {
        formatters: {
          level(label) {
            return { level: label.toUpperCase() };
          },
          bindings(bindings) {
            return { pid: bindings.pid, host: bindings.hostname };
          },
        },
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
      }),
  base: isDev ? undefined : { service: 'vendor-backend', env: NODE_ENV },
});

// ─── Child Logger Factory ────────────────────────────────────────────
const createModuleLogger = (moduleName) => {
  return logger.child({ module: moduleName });
};

// ─── pino-http Options (used by app.js) ──────────────────────────────
const httpLoggerOptions = {
  logger,
  autoLogging: {
    ignore: (req) => {
      return req.url === '/health' || req.url === '/favicon.ico';
    },
  },
  genReqId: (req) => {
    return req.headers['x-request-id'] || `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} → ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} → ${res.statusCode} | ${err.message}`;
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customProps: (req) => ({
    ...(req.user?.id && { userId: req.user.id }),
  }),
  serializers,
};

module.exports = {
  logger,
  createModuleLogger,
  httpLoggerOptions,
};
