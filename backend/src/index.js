'use strict';

require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const devConfig = require('./config/development');
const { logger } = require('./utils/logger');

const PORT = devConfig.server.port;

// Test database connection with Sequelize
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    logger.info(
      `Database connected: ${devConfig.database.database}@${devConfig.database.host}:${devConfig.database.port}`
    );
  } catch (error) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
      },
      'Unable to connect to the database'
    );
    logger.info("Database connection failed");
  }
}

// Start server
async function startServer() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Log level: ${process.env.LOG_LEVEL || 'info'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Database: ${sequelize.config.database} on ${sequelize.config.host}:${sequelize.config.port}`);
    });

    await testDatabaseConnection();

    // Graceful shutdown handling
    const gracefulShutdown = async () => {
      logger.info('Shutdown signal received. Closing server...');

      server.close(async () => {
        logger.info('HTTP server closed');

        // Close Sequelize connection
        try {
          await sequelize.close();
          logger.info('Database connection closed successfully');
        } catch (closeError) {
          logger.error({ error: closeError.message }, 'Error closing database connection');
        }

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error(
        {
          reason: reason.message || reason,
          promise,
        },
        'Unhandled Rejection'
      );
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error(
        {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        'Uncaught Exception'
      );
      process.exit(1);
    });
  } catch (error) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
      },
      'Server startup failed'
    );
    process.exit(1);
  }
}

startServer();
