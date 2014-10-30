/**
 * Central dispatcher, provides a single interface to wrap specific channel dispatchers.
 */

var lodash = require('lodash');
var q = require('q');

var APNSDispatcher = require('./apns_dispatcher');
var GCMDispatcher = require('./gcm_dispatcher');

var PushDispatcher = function(channels, channelsConfig) {
  this.channels = channels;

  this.dispatchers = {};

  // There's some kind of subtle issue wrt to node module loading patterns that means that doing
  // something like require('./' + channel + '_dispatcher') and using the resulting Dispatcher class
  // causes mocks applied to the prototype of that class to get wiped off. This means that sinon
  // mock verify calls then subsequently fail out in test. To avoid this,
  if (lodash.contains(this.channels, 'APNS')) {
    var channelConfig = lodash.isUndefined(channelsConfig['APNS']) ? {} : channelsConfig['APNS'];
    this.dispatchers['APNS'] = new APNSDispatcher('APNS', channelConfig);
  }

  if (lodash.contains(this.channels, 'GCM')) {
    var channelConfig = lodash.isUndefined(channelsConfig['GCM']) ? {} : channelsConfig['GCM'];
    this.dispatchers['GCM'] = new GCMDispatcher('GCM', channelConfig);
  }
};


/**
 * Registers a function to use to handle feedback from a remote push service.
 * @param channel The name of the channel to register.
 * @param feedbackCallback The callback to use when the channel's service sends feedback.
 */
PushDispatcher.prototype.registerChannelFeedbackHandler = function(channel, feedbackHandler) {

  var dispatcher = this.dispatchers[channel];
  if (lodash.isUndefined(dispatcher)) {
    throw new Error('no dispatcher registered for ' + channel);
  }

  dispatcher.registerChannelFeedbackHandler(feedbackHandler);
};


/**
 * Dispatch a push notification to the requested channels.
 * @param channels Object containing channel specific notification and deviceIds.
 * @param done
 */
PushDispatcher.prototype.dispatch = function(channels, done) {
  var promises = [];

  lodash.forEach(this.dispatchers, function(dispatcher) {
    if (lodash.contains(channels, dispatcher.channel)) {

      var channel = channels[dispatcher.channel];
      var dispatcherPromise = dispatcher.dispatch(channel.deviceIds, channel.notification);

      promises.push(dispatcherPromise);
    }
  });

  q.all(promises)
    .then(done);

};


module.exports = PushDispatcher;
