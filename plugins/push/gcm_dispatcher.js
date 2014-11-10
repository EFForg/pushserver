/**
 * Dispatcher to send notifications to clients via GCM.
 */

var gcm = require('node-gcm');
var q = require('q');
var util = require('util');

var ChannelDispatcher = require('./channel_dispatcher');


var GCMDispatcher = function(channel, config) {
  ChannelDispatcher.call(this, channel, config);
};

util.inherits(GCMDispatcher, ChannelDispatcher);


GCMDispatcher.prototype.dispatch = function(registrationIds, message) {
  GCMDispatcher.super_.prototype.dispatch.call(this, registrationIds, message);

  var defer = q.defer();

  var gcmMessage = new gcm.Message(message);
  var sender = new gcm.Sender(this.config.apiKey);

  console.log(registrationIds);
  console.log(message);

  sender.send(gcmMessage, registrationIds, 3, function(err, result) {
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
