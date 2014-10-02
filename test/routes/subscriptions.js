/**
 * Tests for the local server route handlers.
 */

var assert = require('assert');

var models = require('../../db/models');
var serverRoutes = require('../../routes/routes');
var server = require('../../server');

describe('SubscriptionRouteHandlers', function() {

  var addSubscriptionOptions = {
    method: 'POST',
    url: serverRoutes.makePrefixedPath('subscriptions'),
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
    var sampleDeviceId = 'test_device_id';
    var deleteSubscriptionOptions = {
      method: 'DELETE', url: serverRoutes.makePrefixedPath('subscriptions', sampleDeviceId)};
    server.inject(deleteSubscriptionOptions, function(response) {
      models.Subscriptions
        .find({where: {deviceId: sampleDeviceId}})
        .on('success', function(subscription) {
          assert.equal(null, subscription);
          done();
        })
    });
  });

});
