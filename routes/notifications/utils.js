/**
 * Utility functions for the notification route handlers.
 */

var config = require('config');
var lodash = require('lodash');

var models = require('../../db/models');

var SUPPORTED_CHANNELS = config.get('SUPPORTED_CHANNELS');
var fcmDispatcher = require('../../plugins/push/fcm_dispatcher');

/**
 * Constructs a Sequelize-friendly criteria object to search for notifications.
 *
 * @param query The query parameters submitted to the server
 * @returns {{offset: Number, limit: Number, order: *}}
 */
var getNotificationFindCriteria = function(query) {
  // NOTE: due to its complexity and the fact it's a 3rd-party lib, the getNotifications query
  //       object from datatables isn't Joi-validated
  var search = query['search[value]'];

  var findCriteria = {
    offset: parseInt(query.start),
    limit: parseInt(query.length),
    order: lodash.map(query.order, function(order) {
      return [query['columns['+order.column+'][data]'], order.dir];
    })
  };

  if (search !== '') {
    findCriteria.where = ["payload LIKE '%" + search + "%'"];
  }

  return findCriteria;
};


/**
 * Creates a clean notification object from a Hapi request payload.
 *
 * @param payload
 * @returns {Object}
 */
var notificationFromPayload = function(payload) {

  var channels = lodash.isUndefined(payload.channels) ? SUPPORTED_CHANNELS : payload.channels;

  var emptyStats = {idCount: 0, success: 0, unregistered: 0, failure: 0};
  var stats = lodash.zipObject(lodash.map(channels, function(channel) {
    return [channel, lodash.clone(emptyStats)];
  }));
  stats.total = lodash.clone(emptyStats);

  // TODO(leah): Add in an assertion check to ensure that if deviceIds have been provided
  //             that the notification is only going to a single channel.
  var notification = {
    title: lodash.isUndefined(payload.title) ? null : payload.title,
    message: payload.message,
    sound: lodash.isUndefined(payload.sound) ? null : payload.sound,
    data: lodash.isUndefined(payload.data) ? null : payload.data,
    channels: channels,
    mode: lodash.isUndefined(payload.mode) ? 'prod' : payload.mode, // NOTE: default prod
    deviceIds: lodash.isUndefined(payload.deviceIds) ? null : payload.deviceIds,
    state: 'pending',
    stats: stats
  };
  notification.payload = lodash.cloneDeep(notification);

  return notification;
};


/**
 * Sends a notification out via the supported channels
 *
 * @param notification The notification to send.
 * @param topic The topic on which to broadcast the notification.
 */
var sendNotification = function(notification, topic) {
  var message = fcmDispatcher.dispatchToTopic(topic, notification);

  if (message) {
    message.then(function() {
      updateNotificationState(notification.notificationId, 'success');
    })
    .catch(function(err) {
      updateNotificationState(notification.notificationId, 'failed');
    });
  }
};


/**
 * Updates the specified notification to the supplied state.
 * @param notificationId
 * @param state
 */
var updateNotificationState = function(notificationId, state) {
  models.Notifications
    .find({where: {notificationId: notificationId}})
    .then(function(notification) {
      notification.state = state;

      return notification.save()
        .then(function() {}, function(err) {
          logger.error(
            'Unable to update notificationId %s to state %s, failed with:\n%s',
            notificationId, state, err.toString());
        });
    })
    .catch(function(err) {
      logger.error(
        'Unable to update notificationId %s to failed state, failed with:\n%s',
        notificationId, err.toString());
    });
}


module.exports.getNotificationFindCriteria = getNotificationFindCriteria;
module.exports.notificationFromPayload = notificationFromPayload;
module.exports.sendNotification = sendNotification;
