/**
 * Tests for the notification utility methods.
 */

var assert = require('assert');
var config = require('config');
var lodash = require('lodash');
var sinon = require('sinon');

var notificationUtils = require('../../routes/notifications/utils');
var fcmDispatcher = require('../../plugins/push/fcm_dispatcher');
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
  });

  describe('sendNotification', function() {
    it('should send a notification to FCM.TOPIC', function(done) {

      var notification = notificationUtils.notificationFromPayload({
        message: 'fetchFromDB',
        channels: ['FCM']
      });

      var mock = sinon.mock(fcmDispatcher)
                  .expects('dispatchToTopic').once();

      notificationUtils.sendNotification(notification, 'topic');
      mock.verify();

      done();

    });

  });

});
