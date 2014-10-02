/**
 * Utility functions for helping with push notifications.
 */

var apn = require('apn');
var lodash = require('lodash');

var credentials = require('config').get('CREDENTIALS');
var modelUtils = require('./db/model_utils');
var pushConfig = require('config').get('PUSH');

var configurePushServices = function() {
  configureAPNSFeedback();
};

var configureAPNSFeedback = function() {

  var options = {
    'key': credentials.get('APNS').get('KEY_FILE'),
    'cert': credentials.get('APNS').get('CERT_FILE'),
    'batchFeedback': true,
    'interval': pushConfig.get('APNS_FEEDBACK_INTERVAL')
  };

  var feedback = new apn.Feedback(options);
  feedback.on('feedback', function(devices) {

    lodash.forEach(devices, function(item) {
      var error = function(err) {
        console.log(
          'Unable to delete subscription to APNS with deviceId: ' + item.device + '\n err: ' + err);
      };

      modelUtils.deleteSubscription(item.device, null, error);
    });

  });
};

var pruneAndroidDeviceId = function() {

};

module.exports.configurePushServices = configurePushServices;
module.exports.pruneAndroidDeviceId = pruneAndroidDeviceId;
