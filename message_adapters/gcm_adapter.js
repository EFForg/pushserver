/**
 * Adapter to create a GCM friendly message from a notification object.
 * @constructor
 */

var lodash = require('lodash');
var util = require('util');

var ChannelMessageAdapter = require('./channel_message_adapter');


var GCMMessageAdapter = function(channel, notification, subscriptions) {
  ChannelMessageAdapter.call(this, channel, notification, subscriptions);
};

util.inherits(GCMMessageAdapter, ChannelMessageAdapter);


/** @override */
GCMMessageAdapter.prototype.createMessage = function(notification) {

  var gcmMessage = {
    dry_run: notification.mode === 'sandbox',
    data: {
      message: notification.message,
      title: notification.title
    }
  };

  lodash.assign(gcmMessage.data, notification.data);

  return gcmMessage;

};


module.exports = GCMMessageAdapter;
