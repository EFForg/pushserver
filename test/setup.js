/**
 * Mocha setup.
 */

var async = require('async');
var lodash = require('lodash');

var db = require('../db/db');
var dbUtils = require('../db/db_utils');
var models = require('../db/models');


before(function(done) {
  var syncComplete = function() {
    async.parallel(
      [populateSubscriptionData, populateNotificationData],
      function() {
        console.log('Completed test bootstrapping\n');
        done();
      }
    );
  };

  var syncError = function(error) {
    console.log('Unable to synchronize database: ' + error);
  };

  dbUtils.syncDatabase(syncComplete, syncError, true);
});


after(function() {
  // Force close the underlying sqlite3 connection
  var defaultConn = db.connectionManager.connections['default'];
  defaultConn.close();
  db.close();
});


var populateSubscriptionData = function(done) {
  var sampleSub = {channel: 'APNS',language: 'en', deviceId: 'test_device_id'};
  models.Subscriptions.build(sampleSub).save().on('success', function() {
    done();
  });
};


var populateNotificationData = function(done) {
  models.Notifications.sync().on('success', function() {
    done();
  });
};
