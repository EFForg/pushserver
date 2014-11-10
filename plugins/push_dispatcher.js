/**
 * Hapi plugin to manage push notification dispatching.
 */

var PushDispatcher = require('./push/push_dispatcher');

var register = function(plugin, options, next) {

  var pushDispatcher = new PushDispatcher(options.channels, options.channelConfig);

  plugin.method('dispatchPushNotification', function(channelData, done) {
    pushDispatcher.dispatch(channelData, done);
  });

  plugin.method('registerChannelFeedbackHandler', function(channel, handler) {
    pushDispatcher.registerChannelFeedbackHandler(channel, handler);
  });

  next();
};

register.attributes = {
  name: 'pushDispatcher',
  version: '0.0.1'
};


module.exports.register = register;
