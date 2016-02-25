/**
 * Utilities for working with the push server database.
 */

var db = require('./db');

var syncDatabase = function(success, failure, force) {

  db
    .sync({force: !!force})
    .then(success, failure);

};

module.exports.syncDatabase = syncDatabase;
