/**
 * Tests for the local server route handlers.
 */

var assert = require('assert');

var models = require('../../db/models');
var routeUtils = require('../../routes/utils');
var server = require('../../server');


describe('SubscriptionRouteHandlers', function() {

  var addSubscriptionOptions = {
    method: 'POST',
    url: routeUtils.makePrefixedPath('subscriptions'),
    payload: {
      channel: 'APNS',
      language: 'en',
      deviceId: 'pretend_device_token'
    }
  };

  it('should add a subscription to the database', function(done) {
    server.inject(addSubscriptionOptions, function(response) {

      assert(200, response.statusCode);

      models.Subscriptions
        .find({where: {subscriptionId: 1}})
        .on('success', function(subscription) {
          assert.notEqual(null, subscription);
          done();
        });
    });
  });

  it('should not add a new subscription to the database', function(done) {
    server.inject(addSubscriptionOptions, function(response) {
      assert(201, response.statusCode);
      done();
    });
  });

  it('should delete a subscription from the database', function(done) {
    var sampleDeviceId = 'device_id_to_be_deleted';
    var deleteSubscriptionOptions = {
      method: 'DELETE', url: routeUtils.makePrefixedPath('subscriptions', sampleDeviceId)};

    server.inject(deleteSubscriptionOptions, function(response) {

      models.Subscriptions
        .find({where: {deviceId: sampleDeviceId}})
        .on('success', function(subscription) {
          assert.equal(null, subscription);
          done();
        });

    });
  });

});
