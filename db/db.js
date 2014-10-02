/**
 * Push server database instantiation.
 */

var Sequelize = require('sequelize');

var dbConfig = require('config').get('DATABASE');

var db = new Sequelize(
  dbConfig.get('DB_NAME'), dbConfig.get('USERNAME'), dbConfig.get('PASSWORD'),
  dbConfig.get('OPTIONS'));

module.exports = db;
