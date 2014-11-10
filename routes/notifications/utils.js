/**
 * Utility functions for the notification route handlers.
 */

var config = require('config');
var lodash = require('lodash');

var models = require('../../db/models');

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
  var groupedSubscriptions = lodash.zipObject(lodash.map(channels, function(channel) {
    return [channel, []];
  }));
  models.Subscriptions
    .findAll({where: {channel: channels}})
    .on('success', function(subscriptions) {

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


module.exports.getNotificationFindCriteria = getNotificationFindCriteria;
module.exports.notificationFromPayload = notificationFromPayload;
module.exports.fetchDeviceIdsForChannels = fetchDeviceIdsForChannels;
