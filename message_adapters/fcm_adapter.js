/**
 * Adapter to create a FCM friendly message from a notification object.
 * @constructor
 */

var lodash = require('lodash');
var util = require('util');

var ChannelMessageAdapter = require('./channel_message_adapter');


var FCMMessageAdapter = function(channel, notification, subscriptions) {
  ChannelMessageAdapter.call(this, channel, notification, subscriptions);
};

util.inherits(FCMMessageAdapter, ChannelMessageAdapter);


/** @override */
FCMMessageAdapter.prototype.createMessage = function(notification) {

  var fcmMessage = {
    data: {
      message: notification.message,
      title: notification.title
    }
  };

  lodash.assign(fcmMessage.data, notification.data);

  return fcmMessage;

};


module.exports = FCMMessageAdapter;
