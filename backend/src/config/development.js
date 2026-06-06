'use strict';

function parseCommaSeparatedOrigins(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

const CORS_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5173/',
  'http://localhost:5174',
  'http://localhost',
];

const corsAllowedOrigins = [
  ...new Set([
    ...CORS_DEV_ORIGINS,
    ...parseCommaSeparatedOrigins(process.env.CORS_ORIGIN),
  ]),
];

module.exports = {
  server: {
    port: Number(process.env.PORT) || 8080,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
    database: process.env.DB_NAME || 'erp',
    dialect: 'postgres',
    dialectOptions: (() => {
      const dbSslRaw = String(process.env.DB_SSL || '').toLowerCase();
      if (dbSslRaw === 'true' || dbSslRaw === '1') {
        const rejectUnauthorized =
          String(process.env.DB_SSL_REJECT_UNAUTHORIZED || '').toLowerCase() === 'true';
        return {
          ssl: {
            require: true,
            rejectUnauthorized,
          },
        };
      }
      return {};
    })(),
    logging: process.env.DB_LOGGING === 'true' || false,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 10,
      min: Number(process.env.DB_POOL_MIN) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: Number(process.env.DB_POOL_IDLE) || 10000,
    },
  },

  cors: {
    allowedOrigins: corsAllowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Request-Id',
      'Accept',
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    pretty: true,
  },

  security: {
    helmet: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    },
  },
};
