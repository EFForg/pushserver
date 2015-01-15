/**
 * Base class for channel specific message adapters.
 * @constructor
 */

var lodash = require('lodash');


var ChannelMessageAdapter = function(channel, notification, subscriptions) {
  /**
   * The channel this adapter adapts.
   * @type {string}
   */
  this.channel = channel;

  /**
   * An object adapted to send a message on the adapter's channel.
   * @type {{}}
   */
  this.message = this.createMessage(notification);

  /**
   * An array of deviceIds to send the associated message to.
   * @type {Array.<string>}
   */
  this.deviceIds = lodash.map(subscriptions, function(sub) {
    return lodash.isString(sub) ? sub : sub.deviceId;
  });
};


/**
 * Creates a channel specific message from a notification object.
 * @param notification
 * @returns {{}}
 */
ChannelMessageAdapter.prototype.createMessage = function(notification) {
  return {};
};


module.exports = ChannelMessageAdapter;
