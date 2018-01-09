/**
 * Dispatcher to send notifications to clients via GCM.
 */

var async = require('async');
var chunk = require('chunk');
var firebase = require('firebase-admin');
var config = require('config');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');
var util = require('util');

var ChannelDispatcher = require('./channel_dispatcher');

var DEREGISTRATION_ERR_MSGS = [
  'NotRegistered',
  'InvalidRegistration'
];


var GCMDispatcher = function(config) {
  ChannelDispatcher.call(this, 'GCM', config);
};

util.inherits(GCMDispatcher, ChannelDispatcher);

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: config.CREDENTIALS.GCM.PROJECT_ID,
    clientEmail: config.CREDENTIALS.GCM.CLIENT_EMAIL,
    privateKey: config.CREDENTIALS.GCM.PRIVATE_KEY
  }),
  databaseURL: config.CREDENTIALS.GCM.DATABASE_URL
});


/**
 * Sends a GCM message to the supplied registrationIds.
 *
 * @param {*} sender The GCM sender object to use to send the message
 * @param {*} gcmMessage The GCM message object to send.
 * @param {string[]} max1KRegistrationIds Array of registrationIds to send, max 1K.
 * @param {function} callback The callback to call once send completes.
 * @private
 */
GCMDispatcher.prototype.dispatchMessageToRegistrationIds_ = function(
  sender, gcmMessage, max1KRegistrationIds, callback) {

  var sendCallback = lodash.bind(function(err, result) {
    // Stitch the original registrationIds onto the object. This is to allow us to figure out the
    // registrationIds of failed messages. In that case, the index of the registrationId is equal
    // to the index of the object in the results array.
    callback(null, {result: result, registrationIds: max1KRegistrationIds});
  });

  var errorCallback = lodash.bind(function(error) {
    logger.error('Call to GCM failed with: %s', error);
    callback(error, {result: result, registrationIds: max1KRegistrationIds});
  });

  sender.sendToDevice(max1KRegistrationIds, gcmMessage)
    .then(sendCallback)
    .catch(errorCallback);
};


/**
 * Gets send stats from the results returned by GCM.
 * @param results
 * @returns {Array}
 */
GCMDispatcher.prototype.getSendResults = function(results) {
  var stats = this.getEmptyStatsObject();
  var failedIds = [];

  lodash.forEach(results, function(nestedResultsObj) {

    var registrationIds = nestedResultsObj.registrationIds;
    var nestedResults = nestedResultsObj.result;

    stats.idCount += registrationIds.length;
    if (lodash.isObject(nestedResults)) {
      stats.success += nestedResults.success;
      stats.failure += nestedResults.failure;

      // Nested loop is required unfortunately :(
      lodash.forEach(nestedResults.results, function(registrationIdResult, i) {
        if (lodash.contains(DEREGISTRATION_ERR_MSGS, registrationIdResult.error)) {
          stats.unregistered++;
          stats.failure--;
          failedIds.push(registrationIds[i]);
        }
      });
    } else {
      stats.failure += registrationIds.length;
    }
  }, this);

  return [stats, failedIds];
};


/** @inherits */
GCMDispatcher.prototype.dispatch = function(registrationIds, message, done) {
  GCMDispatcher.super_.prototype.dispatch.call(this, registrationIds, message);

  var gcmMessage = message;
  var sender = firebase.messaging();

  var registrationIdChunks = chunk(registrationIds, 1000);
  var chunkFunctions = lodash.map(registrationIdChunks, function(registrationIdsChunk) {
    return lodash.bind(
      this.dispatchMessageToRegistrationIds_, this, sender, gcmMessage, registrationIdsChunk);
  }, this);

  // NOTE: series is used here as a precaution in case the internals of node-gcm aren't friendly
  //       to being accessed with different registrationId chunks concurrently.
  async.series(chunkFunctions, lodash.bind(function(err, results) {
    var sendResults = this.getSendResults(results);
    this.feedbackHandler(sendResults[1]);

    if (err) {
      // Send the results stats back even if there was an error, to facilitate deciding whether to
      // re-send the notification.
      done(err, sendResults[0]);
    } else {
      done(null, sendResults[0]);
    }
  }, this));
};


module.exports = GCMDispatcher;
