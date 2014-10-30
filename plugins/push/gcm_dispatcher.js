/**
 * Dispatcher to send notifications to clients via GCM.
 */

var gcm = require('node-gcm');
var lodash = require('lodash');

var ChannelDispatcher = require('./channel_dispatcher');


var GCMDispatcher = function(channel, config) {
  ChannelDispatcher.call(this, channel, config);
};

GCMDispatcher.prototype = lodash.create(
  ChannelDispatcher.prototype,
  {'constructor': GCMDispatcher, '_super': ChannelDispatcher.prototype}
);


GCMDispatcher.prototype.dispatch = function(registrationIds, notification, done) {
  this._super.dispatch.call(this, registrationIds, notification);

  var defer = q.defer();

  var message = new gcm.Message(notification);
  var sender = new gcm.Sender(this.config.apiKey);

  sender.send(message, registrationIds, 3, function(err, result) {
    // TODO(leah): Figure out how to pass back feedback.
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve();
    }
  });

  return defer.promise;
};


module.exports = GCMDispatcher;
