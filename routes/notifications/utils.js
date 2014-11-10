/**
 * Utility functions for the notification route handlers.
 */

var config = require('config');
var lodash = require('lodash');

var models = require('../../db/models');
var MessageAdapter = require('../../message_adapters/message_adapter');

var SUPPORTED_CHANNELS = config.get('SUPPORTED_CHANNELS');


/**
 * Constructs a Sequelize-friendly criteria object to search for notifications.
 *
 * @param query The query parameters submitted to the server
 * @returns {{offset: Number, limit: Number, order: *}}
 */
var getNotificationFindCriteria = function(query) {
  // NOTE: due to its complexity and the fact it's a 3rd-party lib, the getNotifications query
  //       isn't Joi-validated
  var search = query.search.value;

  var findCriteria = {
    offset: parseInt(query.start),
    limit: parseInt(query.length),
    order: lodash.map(query.order, function(order) {
      return [query.columns[order.column].data, order.dir];
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
  var notification = {
    title: lodash.isUndefined(payload.title) ? null : payload.title,
    message: payload.message,
    sound: lodash.isUndefined(payload.sound) ? null : payload.sound,
    data: lodash.isUndefined(payload.data) ? null : payload.data,
    channels: lodash.isUndefined(payload.channels) ? SUPPORTED_CHANNELS : payload.channels,
    mode: lodash.isUndefined(payload.mode) ? 'prod' : payload.mode, // NOTE: default prod
    deviceIds: lodash.isUndefined(payload.deviceIds) ? null : payload.deviceIds
  };
  notification.payload = lodash.cloneDeep(notification);

  return notification;
};


/**
 * Fetches the device ids subscribed to the supplied channels.
 *
 * @param channels The channels to fetch device ids for.
 * @param done The callback to call once the fetch completes.
 */
var fetchDeviceIdsForChannels = function(channels, success, error) {

  var queryCriteria = {
    where: {channel: channels},
    attributes: ['subscriptionId', 'language', 'deviceId', 'channel']
  };

  // TODO(leah): This should move to a limit / offset based iterator. Unfortunately, sequelize
  //             doesn't seem to support lazy iteration of query results. So, implement a wrapper
  //             to protect against pulling a huge result and getting mem issues.
  models.Subscriptions
    .findAll(queryCriteria, {raw: true})  // Use raw to reduce object footprint
    .on('success', function(subscriptions) {

      var groupedSubscriptions = lodash.zipObject(lodash.map(channels, function(channel) {
        return [channel, []];
      }));

      lodash.forEach(subscriptions, function(subscription) {
        groupedSubscriptions[subscription.channel].push({
          subscriptionId: subscription.subscriptionId,
          language: subscription.language,
          deviceId: subscription.deviceId
        });
      });

      success(groupedSubscriptions);
    })
    .on('error', error);

};


//
//          // TODO(leah): Update the local DB to indicate the push notification has completed
//          console.log('dispatch completed');
//        });


/**
 * Sends a notification to all listening channels.
 * @param notification The notification to send.
 */
var sendNotification = function(notification, dispatchFn) {
  // TODO(leah): Stuff this all in a promise.

  // TODO(leah): Update this to use an iterator of some kind, so we're not shuttling around objects
  //             that could be arbitrarily large.
  fetchDeviceIdsForChannels(
    notification.channels,
    function(groupedSubscriptions) {
      var messageAdapter = new MessageAdapter(notification, groupedSubscriptions);

      var channelData = lodash.zipObject(lodash.map(messageAdapter.adapters, function(adapter, channel) {
        return [channel, {deviceIds: adapter.deviceIds, message: adapter.message}];
      }));

      console.log(channelData);
      dispatchFn(channelData, function() {

      });

    },
    function(error) {
      // TODO(leah): Update the notification to failed state
    }
  );


};


module.exports.getNotificationFindCriteria = getNotificationFindCriteria;
module.exports.notificationFromPayload = notificationFromPayload;
module.exports.fetchDeviceIdsForChannels = fetchDeviceIdsForChannels;
module.exports.sendNotification = sendNotification;
