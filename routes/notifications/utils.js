/**
 * Utility functions for the notification route handlers.
 */

var async = require('async');
var config = require('config');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');

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

  var channels = lodash.isUndefined(payload.channels) ? SUPPORTED_CHANNELS : payload.channels;

  var emptyStats = {idCount: 0, success: 0, unregistered: 0, failure: 0};
  var stats = lodash.zipObject(lodash.map(channels, function(channel) {
    return [channel, lodash.clone(emptyStats)];
  }));
  stats.total = lodash.clone(emptyStats);

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


/**
 * Sends a notification out via the supported channels
 *
 * @param notification The notification to send.
 * @param {function} dispatchFn The function responsible for sending the adapted messages and
 *     deviceIds to the remote servers for distribution.
 */
var sendNotification = function(notification, dispatchFn) {
  // TODO(leah): Update this to use an iterator of some kind, so we're not shuttling around objects
  //             that could be arbitrarily large.
  fetchDeviceIdsForChannels(
    notification.channels,
    function(groupedSubscriptions) {
      var arrLengths = lodash.map(groupedSubscriptions, function(val) {
        return val.length;
      });

      var devicesToSendTo = lodash.reduce(arrLengths, function(sum, num) {
        return sum + num;
      }) > 0;

      if (devicesToSendTo) {
        sendNotificationToSubscribers(notification, groupedSubscriptions, dispatchFn);
      } else {
        updateNotificationStateAndStats(notification.notificationId, 'success', undefined);
      }
    },
    function(err) {
      logger.error('Fetching device ids for channels %s failed with:\n%s', channels, err.toString());
      updateNotificationStateAndStats(notification.notificationId, 'error', undefined);
    }
  );
};


/**
 *
 * @param notification
 * @param groupedSubscriptions
 * @param {function} dispatchFn The function responsible for sending the adapted messages and
 *     deviceIds to the remote servers for distribution.
 */
var sendNotificationToSubscribers = function(notification, groupedSubscriptions, dispatchFn) {
  var msgAdapter = new MessageAdapter(notification, groupedSubscriptions);

  var wrappedDispatchFn = function(channel, deviceIds, message, callback) {
    dispatchFn(channel, deviceIds, message, function(err, results) {
      callback(err, lodash.zipObject([channel], [results]))
    });
  };

  var channelDispatchFns = lodash.map(msgAdapter.adapters, function(adapter, channel) {
    return lodash.partial(wrappedDispatchFn, channel, adapter.deviceIds, adapter.message);
  });

  async.parallel(channelDispatchFns, function(err, results) {

    var stats = summarizeNotificationStats(results);

    if (lodash.isUndefined(err)) {
      updateNotificationStateAndStats(notification.notificationId, 'success', stats);
    } else {
      updateNotificationStateAndStats(notification.notificationId, 'failed', stats);
    }
  });
};


/**
 * Gets a stats object showing total success across all channels.
 *
 * @param {Array.<Object>} results array of stats objects to summarize.
 * @returns {*}
 */
var summarizeNotificationStats = function(results) {
  var emptyStats = {idCount: 0, success: 0, unregistered: 0, failure: 0};

  var incrementStats = function(total, subTotal) {
    total.idCount += subTotal.idCount;
    total.success += subTotal.success;
    total.unregistered += subTotal.unregistered;
    total.failure += subTotal.failure;
  };

  return lodash.reduce(results, function(accumulator, subTotal) {

    var channel = lodash.keys(subTotal)[0];
    var subTotalStats = lodash.values(subTotal)[0];

    if (!lodash.has(accumulator, channel)) {
      accumulator[channel] = lodash.clone(emptyStats);
    }

    incrementStats(accumulator.total, subTotalStats);
    incrementStats(accumulator[channel], subTotalStats);

    return accumulator;
  }, {total: lodash.cloneDeep(emptyStats)});
};

/**
 * Updates the specified notification to the supplied state.
 * @param notificationId
 * @param state
 * @param opt_stats
 */
var updateNotificationStateAndStats = function(notificationId, state, opt_stats) {
  models.Notifications
    .find({where: {notificationId: notificationId}})
    .on('success', function(notification) {
      notification.state = state;

      if (!lodash.isUndefined(opt_stats)) {
        notification.stats = opt_stats;
      }

      notification.save()
        .on('error', function(err) {
          logger.error(
            'Unable to update notificationId %s to state %s, failed with:\n%s',
            notificationId, state, err.toString());
        });
    })
    .on('error', function(err) {
      logger.error(
        'Unable to update notificationId %s to failed state, failed with:\n%s',
        notificationId, err.toString());
    });
};


module.exports.getNotificationFindCriteria = getNotificationFindCriteria;
module.exports.notificationFromPayload = notificationFromPayload;
module.exports.fetchDeviceIdsForChannels = fetchDeviceIdsForChannels;
module.exports.sendNotification = sendNotification;
module.exports.summarizeNotificationStats = summarizeNotificationStats;
