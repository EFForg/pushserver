/**
 * Tests for the notification utility methods.
 */

var assert = require('assert');
var config = require('config');

var utils = require('../../routes/notifications_utils');

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

    var findCriteria = utils.getNotificationFindCriteria(payload);
    assert.equal(findCriteria.offset, 0);
    assert.equal(findCriteria.limit, 15);
    assert.equal(findCriteria.where, "payload LIKE '%test%'");
    assert.deepEqual(findCriteria.order, [['notificationId', 'asc'], ['title', 'desc']]);
  });

  it('should get a clean notification object', function() {
    var notification = utils.notificationFromPayload({message: 'test'});
    assert.equal(notification.title, null);
    assert.equal(notification.sound, null);
    assert.equal(notification.data, null);
    assert.deepEqual(notification.channels, SUPPORTED_CHANNELS);
    assert.equal(notification.mode, 'prod');
    assert.equal(notification.deviceIds, null);
  });

  it('should get a set of subscription objects for specific channels', function(done) {
    utils.fetchDeviceIdsForChannels(
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

});
