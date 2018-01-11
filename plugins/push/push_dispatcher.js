/**
 * Central dispatcher, provides a single interface to wrap specific channel dispatchers.
 */

var lodash = require('lodash');
var util = require('util');

var APNSDispatcher = require('./apns_dispatcher');
var FCMDispatcher = require('./fcm_dispatcher');


/**
 * @param channels Array of channels the push dispatcher should support.
 * @param channelsConfig Object, keyed on channel name, values of configuration for that channel.
 * @constructor
 */
var PushDispatcher = function(channels, channelsConfig) {

  /**
   * The channels this push dispatcher should support.
   * @type {Array.<string>}
   */
  this.channels = channels;

  /**
   * Object, keyed on channel name, value of the associated channel dispatcher.
   * @type {{}}
   */
  this.dispatchers = {};

  /**
   * Object, keyed on channel name, value of the available dispatcher classes.
   * @type {{}}
   * @privaate
   */
  this.dispatcherClasses_ = {
    APNS: APNSDispatcher,
    FCM: FCMDispatcher
  };

  lodash.forEach(this.channels, function(channel) {
    var channelConfig = lodash.isUndefined(channelsConfig[channel]) ? {} : channelsConfig[channel];
    var DispatcherClass = this.dispatcherClasses_[channel];
    this.dispatchers[channel] = new DispatcherClass(channelConfig);
  }, this);
};


/**
 * Registers a function to use to handle feedback from a remote push service.
 *
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
 *
 * @param channels Object, keyed on channel name, values of channel specific message and deviceIds.
 * @param done
 */
PushDispatcher.prototype.dispatch = function(channel, deviceIds, message, done) {
  var promises = [];

  if (lodash.has(this.dispatchers, channel)) {
    this.dispatchers[channel].dispatch(deviceIds, message, done);
  } else {
    throw new Error(util.format('No dispatcher is available for the channel: %s', channel));
  }

};


module.exports = PushDispatcher;
