const Sequelize = require('sequelize');
const config = require('../config');

var database = config.database;
var db = new Sequelize(
  database.databaseName,
  database.username,
  database.password, {
    host: database.host,
    port: database.port,
    dialect: database.dialect,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    storage: './config/database/db.sqlite',

    logging: false
  }
);

module.exports = db;