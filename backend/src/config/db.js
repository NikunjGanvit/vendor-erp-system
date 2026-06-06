'use strict';

const { Sequelize } = require('sequelize');
const devConfig = require('./development');

const dbConfig = devConfig.database;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ? console.log : false,
    dialectOptions: dbConfig.dialectOptions || {},
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

module.exports = sequelize;
