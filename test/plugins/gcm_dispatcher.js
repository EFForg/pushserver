/**
 * Tests for the GCM Dispatcher.
 */

var assert = require('assert');
var lodash = require('lodash');

var GCMDispatcher = require('../../plugins/push/gcm_dispatcher');


describe('GCMDispatcher', function() {

  var gcmAdapter = new GCMDispatcher('GCM', {});

  it('should correctly parse the result from a message send', function() {

    var deregisterResponse = [
      {
        results: {
          multicast_id: 5487775449680367000,
          success: 0,
          failure: 1,
          canonical_ids: 0,
          results: [{'error': 'NotRegistered'}]
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = gcmAdapter.getSendResults(deregisterResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 0);
    assert.equal(stats.failure, 0);
    assert.equal(stats.unregistered, 1);
    assert.equal(stats.idCount, 1); // Only bother to check this once
    assert.deepEqual(['test-id'], failedIds);

    var totalFailureResponse = [
      {
        results: {
          multicast_id: 5487775449680367000,
          success: 0,
          failure: 1,
          canonical_ids: 0,
          results: [{'error': 'WeirdError'}],
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = gcmAdapter.getSendResults(totalFailureResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 0);
    assert.equal(stats.failure, 1);
    assert.equal(stats.unregistered, 0);
    assert.deepEqual([], failedIds);

    var successResponse = [
      {
        results: {
          multicast_id: 5487775449680367000,
          success: 1,
          failure: 0,
          canonical_ids: 0,
          results: [{registration_id: 'test-id', message_id: 'message_id'}],
        },
        registrationIds: ['test-id']
      }
    ];

    var sendResults = gcmAdapter.getSendResults(successResponse);
    var stats = sendResults[0], failedIds = sendResults[1];

    assert.equal(stats.success, 1);
    assert.equal(stats.failure, 0);
    assert.equal(stats.unregistered, 0);
    assert.deepEqual([], failedIds);

  });

});
