'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const { logger, httpLoggerOptions } = require('./utils/logger');
const devConfig = require('./config/development');

const app = express();

const corsAllowedOriginsSet = new Set(devConfig.cors.allowedOrigins);

// ─── CORS Configuration ──────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const normalize = (o) => o.trim().replace(/\/$/, '');
    const normalizedOrigin = normalize(origin);
    const allowedOrigins = [...corsAllowedOriginsSet].map(normalize);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', normalizedOrigin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: devConfig.cors.methods,
  allowedHeaders: devConfig.cors.allowedHeaders,
  exposedHeaders: devConfig.cors.exposedHeaders,
  optionsSuccessStatus: 200,
};

// ─── Middleware ───────────────────────────────────────────────────────
app.use(helmet(devConfig.security.helmet));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (required behind reverse proxies like Nginx)
app.set('trust proxy', 1);

// Structured HTTP logging via pino-http
app.use(pinoHttp(httpLoggerOptions));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// ─── Routes ──────────────────────────────────────────────────────────
const routes = require('./routes');
app.use('/', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  req.log.warn({ method: req.method, url: req.url }, 'Route not found');
  res.status(404).json({
    success: false,
    error: { message: 'Route not found', code: 'NOT_FOUND' },
    timestamp: new Date().toISOString(),
    requestId: req.id || null,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (req.log && typeof req.log.error === 'function') {
    req.log.error({ err, statusCode }, err.message);
  } else {
    logger.error({ err, statusCode }, err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.name || 'UNKNOWN_ERROR',
      ...(err.details && { details: err.details }),
    },
    timestamp: new Date().toISOString(),
    requestId: req.id || null,
  });
});

module.exports = app;
