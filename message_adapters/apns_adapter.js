/**
 * Adapter to create a APNS friendly message from a notification object.
 * @constructor
 */

var lodash = require('lodash');
var util = require('util');

var ChannelMessageAdapter = require('./channel_message_adapter');


var APNSMessageAdapter = function(channel, notification, subscriptions) {
  ChannelMessageAdapter.call(this, channel, notification, subscriptions);
};

util.inherits(APNSMessageAdapter, ChannelMessageAdapter);


/** @override */
APNSMessageAdapter.prototype.createMessage = function(notification) {

  // TODO(leah): Update this.
  var apnsMessage = {

  };

  lodash.assign(apnsMessage, notification.data);

  return apnsMessage;

};


module.exports = APNSMessageAdapter;
