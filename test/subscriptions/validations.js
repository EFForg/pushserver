/**
 * Tests for the validation functions.
 */

var assert = require('assert');
var lodash = require('lodash');

var subscriptionValidation = require('../../routes/subscriptions/validation');

var SUPPORTED_CHANNELS = require('config').get('SUPPORTED_CHANNELS');


describe('Validation', function() {

  var validSubscription = {
    channel: 'APNS',
    language: 'en-US',
    deviceId: 'pretenddeviceid'
  };

  it('should return undefined for a valid subscription object', function(done) {
    subscriptionValidation.validateSubscriptions(validSubscription, function(err) {
      assert.equal(undefined, err);
      done();
    });
  });

  var badChannelSubscription = lodash.cloneDeep(validSubscription);
  badChannelSubscription.channel = 'MPNS';
  it('should return an error when an unsupported channel is supplied', function(done) {
    subscriptionValidation.validateSubscriptions(badChannelSubscription, function(err) {
      assert(
        err.toString(),
        'ValidationError: channel must be one of ' + SUPPORTED_CHANNELS.join(', ')
      );
      done();
    });
  });

  // Only check the general err handling, don't repeat check items that Joi should cover (e.g. max
  // length)
  var missingDeviceId = {
    channel: 'GCM',
    language: 'en-US'
  };
  it('should return an error for an invalid subscription object', function(done) {
    subscriptionValidation.validateSubscriptions(missingDeviceId, function(err) {
      assert.equal(err.toString(), 'ValidationError: deviceId is required');
      done();
    });
  });

});
