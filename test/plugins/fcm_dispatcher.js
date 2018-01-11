/**
 * Tests for the FCM Dispatcher.
 */

var assert = require('assert');
var lodash = require('lodash');

var FCMDispatcher = require('../../plugins/push/fcm_dispatcher');


describe('FCMDispatcher', function() {

  var fcmAdapter = new FCMDispatcher('FCM', {});

  it('should correctly parse the result from a message send', function() {

    var deregisterResponse = [
      {
        result: {
          multicast_id: 5487775449680367000,
          success: 0,
          failure: 1,
          canonical_ids: 0,
          results: [{'error': 'NotRegistered'}]
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = fcmAdapter.getSendResults(deregisterResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 0);
    assert.equal(stats.failure, 0);
    assert.equal(stats.unregistered, 1);
    assert.equal(stats.idCount, 1); // Only bother to check this once
    assert.deepEqual(['test-id'], failedIds);

    var totalFailureResponse = [
      {
        result: {
          multicast_id: 5487775449680367000,
          success: 0,
          failure: 1,
          canonical_ids: 0,
          results: [{'error': 'WeirdError'}],
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = fcmAdapter.getSendResults(totalFailureResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 0);
    assert.equal(stats.failure, 1);
    assert.equal(stats.unregistered, 0);
    assert.deepEqual([], failedIds);

    var successResponse = [
      {
        result: {
          multicast_id: 5487775449680367000,
          success: 1,
          failure: 0,
          canonical_ids: 0,
          results: [{registration_id: 'test-id', message_id: 'message_id'}],
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = fcmAdapter.getSendResults(successResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 1);
    assert.equal(stats.failure, 0);
    assert.equal(stats.unregistered, 0);
    assert.deepEqual([], failedIds);

  });

});
