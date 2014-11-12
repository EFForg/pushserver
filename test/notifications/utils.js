/**
 * Tests for the notification utility methods.
 */

var assert = require('assert');
var config = require('config');
var lodash = require('lodash');

var notificationUtils = require('../../routes/notifications/utils');

var SUPPORTED_CHANNELS = config.get('SUPPORTED_CHANNELS');


describe('NotificationUtils', function() {

  it('should get a find criteria object', function() {
    var payload = {
      start: '0',
      length: '15',
      order: [{column: '0', dir: 'asc'}, {column: '1', dir: 'desc'}],
      columns: [
        {
          data: 'notificationId',
          name: ''
        },
        {
          data: 'title',
          name: ''
        }
      ],
      search: {value: 'test', regex: 'false'}
    };

    var findCriteria = notificationUtils.getNotificationFindCriteria(payload);
    assert.equal(findCriteria.offset, 0);
    assert.equal(findCriteria.limit, 15);
    assert.equal(findCriteria.where, "payload LIKE '%test%'");
    assert.deepEqual(findCriteria.order, [['notificationId', 'asc'], ['title', 'desc']]);
  });

  it('should get a clean notification object', function() {
    var notification = notificationUtils.notificationFromPayload({message: 'test'});
    assert.equal(notification.title, null);
    assert.equal(notification.sound, null);
    assert.equal(notification.data, null);
    assert.deepEqual(notification.channels, SUPPORTED_CHANNELS);
    assert.equal(notification.mode, 'prod');
    assert.equal(notification.deviceIds, null);
  });

  it('should get a set of subscription objects for specific channels', function(done) {
    notificationUtils.fetchDeviceIdsForChannels(
      SUPPORTED_CHANNELS,
      function(groupedChannels) {
        // Do a >= check to avoid creating any dependencies or need for ordering v-a-v the
        // subscriptions tests
        assert.equal(groupedChannels['APNS'].length >= 2, true);
        assert.equal(groupedChannels['GCM'].length >= 2, true);
        done();
      },
      function(err) {
        throw err;
      });
  });

  it('should correctly summarize push result stats', function() {

    var expected = {
      total: {idCount: 1014, success: 1001, unregistered: 2, failure: 10},
      GCM: {idCount: 1003, success: 1000, unregistered: 2, failure: 0},
      APNS: {idCount: 11, success: 1, unregistered: 0, failure: 10}
    };

    var stats = notificationUtils.summarizeNotificationStats([
      {GCM: {idCount: 1000, success: 998, unregistered: 2, failure: 0}},
      {GCM: {idCount: 3, success: 2, unregistered: 0, failure: 0}},
      {APNS: {idCount: 11, success: 1, unregistered: 0, failure: 10}}
    ]);

    lodash.forEach(stats, function(val, key) {
      assert.deepEqual(val, expected[key]);
    });

  });

});
