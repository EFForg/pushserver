/**
 * Tests for the validation functions.
 */

var assert = require('assert');

var subscriptionValidation = require('../../validation/subscriptions');

describe('Validation', function() {
  describe('#subscriptions', function() {
    var validObj = {
      channel: 'APNS',
      language: 'en-US',
      deviceId: 'pretenddeviceid'
    };

    it('should return null when a valid subscription object is supplied', function(done) {
      subscriptionValidation.validateSubscriptions(validObj, function(err) {
        assert.equal(null, err);
        done();
      });
    });

    validObj.channel = 'MPNS';
    it('should return non-null when an unsupported channel is supplied', function(done) {
      subscriptionValidation.validateSubscriptions(missingDeviceId, function(err) {
        assert.notDeepEqual(null, err);
        done();
      });
    });

    // Only check the general err handling, don't repeat check items that Joi should cover (e.g. max
    // length)
    var missingDeviceId = {
      channel: 'GCM',
      language: 'en-US'
    };
    it('should return non-null when an invalid subscription object is supplied', function(done) {
      subscriptionValidation.validateSubscriptions(missingDeviceId, function(err) {
        assert.notDeepEqual(null, err);
        done();
      });
    });

  });

  describe('#notifications', function() {
    // TODO(leah): Come back to this once I've figured out what constraints to place on the object

    //    var notificationSchema = Joi.object().keys({
    //      // Support an abbreviated version of the full push options
    //      title: Joi.string(),    // the message title, unused for iOS where the app name is used instead by default
    //      message: Joi.string(),  // the message body
    //      sound: Joi.string(),    // the name of a sound file to play, this file must be on the device (iOS only)
    //      data: Joi.object(),     // a bundle of key / value pairs to include in the notification
    //
    //      // admin variables
    //      channels: Joi.string().valid(supportedChannels).default(supportedChannels), // the channel(s) (GCM, APNS) to send to
    //      mode: Joi.string().valid(['prod', 'sandbox']).default('prod'),  // the notification mode, if it's sandbox, the notification will be processed but not sent
    //      deviceIds: Joi.array().includes(Joi.string())   // an array of deviceIds to send the notification to. If not supplied, the server will notify all deviceIds in the database
    //    });

    var validObj = {
      title: 'title',
      message: 'message',
      sound: 'empty',
      data: {}
    };

    it('should return null when a valid notification object is supplied', function(done) {
      subscriptionValidation.validateSubscriptions(validObj, function(err) {
        assert.equal(err, null);
        done();
      });
    });

  });
});
