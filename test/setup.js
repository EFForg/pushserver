/**
 * Mocha setup.
 */

var async = require('async');
var randomstring = require("randomstring");
var sinon = require('sinon');

var db = require('../db/db');
var dbUtils = require('../db/db_utils');
var models = require('../db/models');
var server = require('../server');

before(function(done) {
  var syncComplete = function() {
    populateNotificationData(function() {
      console.log('Completed test bootstrapping\n');
      done();
    });
  };

  var syncError = function(error) {
    console.log('Unable to synchronize database: ' + error);
  };

  dbUtils.syncDatabase(syncComplete, syncError, true);
});


after(function() {
  // Force close the underlying sqlite3 connection
  db.close();
});


var populateNotificationData = function(done) {
  var sampleNotifications = [];

  done();
};
