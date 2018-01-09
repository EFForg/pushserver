/**
 * Wrapper object around an array of channel specific message adapters.
 */

var lodash = require('lodash');

var APNSAdapter = require('./apns_adapter');
var FCMAdapter = require('./fcm_adapter');


/**
 *
 * @param notification
 * @param channelData Object, keyed on channel name, values of subscriptions to send via the channel.
 * @constructor
 */
var MessageAdapter = function(notification, channelData) {

  /**
   * Object, keyed on channel name, value of the available dispatcher classes.
   * @type {{}}
   * @privaate
   */
  this.adapterClasses_ = {
    APNS: APNSAdapter,
    FCM: FCMAdapter
  };

  /**
   * Object, keyed on channel name, value of channel specific message adapter.
   * @type {Object}
   */
  this.adapters = {};

  lodash.forEach(channelData, function(subscriptions, channel) {
    var DispatcherClass = this.adapterClasses_[channel];
    this.adapters[channel] = new DispatcherClass(channel, notification, subscriptions);
  }, this);

};


module.exports = MessageAdapter;
