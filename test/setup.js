/**
 * Mocha setup.
 */

var async = require('async');
var randomstring = require("randomstring");
var sinon = require('sinon');

var apnsDispatcher = require('../plugins/push/apns_dispatcher');
var db = require('../db/db');
var dbUtils = require('../db/db_utils');
var models = require('../db/models');
var pushDispatcher = require('../plugins/push/push_dispatcher');
var server = require('../server');

var registerChannelFeedbackHandlerMock;
var configureAPNSFeedbackServiceMock;

before(function(done) {

  registerChannelFeedbackHandlerMock = sinon.mock(pushDispatcher.prototype)
    .expects('registerChannelFeedbackHandler').twice();

  // the APNS module throws a cert not found error in test mode, causing the test task to hang,
  // so mock the service.
  configureAPNSFeedbackServiceMock = sinon.mock(apnsDispatcher.prototype)
    .expects('configureFeedbackService_').once();

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

  server.registerPlugins(function() {
    dbUtils.syncDatabase(syncComplete, syncError, true);
  });
});


after(function() {
  // Force close the underlying sqlite3 connection
  var defaultConn = db.connectionManager.connections['default'];
  defaultConn.close();
  db.close();

  registerChannelFeedbackHandlerMock.verify();
  configureAPNSFeedbackServiceMock.verify();
});


var populateSubscriptionData = function(done) {
  var sampleSubs = [
    {channel: 'APNS',language: 'en', deviceId: 'device_id_to_be_deleted'},
    {channel: 'APNS',language: 'en', deviceId: randomstring.generate(12)},
    {channel: 'APNS',language: 'en', deviceId: randomstring.generate(12)},
    {channel: 'GCM',language: 'en', deviceId: randomstring.generate(12)},
    {channel: 'GCM',language: 'en', deviceId: randomstring.generate(12)}
  ]

  models.Subscriptions.bulkCreate(sampleSubs)
    .on('success', function() {
      done();
    });
};


var populateNotificationData = function(done) {
  var sampleNotifications = [];

  done();
};
