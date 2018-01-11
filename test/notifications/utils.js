/**
 * Tests for the notification utility methods.
 */

var assert = require('assert');
var config = require('config');
var lodash = require('lodash');
var sinon = require('sinon');

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

  describe('sendNotification', function() {

    it('should respect the deviceIds value when supplied', function(done) {
      var notification = notificationUtils.notificationFromPayload({
        message: 'sendNotification',
        deviceIds: ['abc'],
        channels: ['FCM']
      });

      notificationUtils.sendNotification(notification, function(channel, deviceIds, message) {
        assert.equal(channel, 'FCM');
        assert.deepEqual(deviceIds, ['abc']);
        assert.equal(message.data.message, 'sendNotification');
        done();
      });
    });

    it('should fetch deviceIds from the DB when none are supplied', function(done) {
      var notification = notificationUtils.notificationFromPayload({
        message: 'fetchFromDB',
        deviceIds: [],
        channels: ['FCM']
      });

      notificationUtils.sendNotification(notification, function(channel, deviceIds, message) {
        assert.equal(channel, 'FCM');
        assert.deepEqual(deviceIds, ['FCM_SUB_1', 'FCM_SUB_2']);
        assert.equal(message.data.message, 'fetchFromDB');
        done();
      });
    });

  });

});
