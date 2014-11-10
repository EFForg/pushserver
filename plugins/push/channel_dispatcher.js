/**
 * Base class for all channel dispatchers.
 */

/**
 * Channel specific dispatcher, responsible for sending notifications via the bound channel
 * @param channel The channel (APNS, GCM etc.) to send notifications to
 * @param config A configuration object for managing the channel connection or dispatcher behavior.
 * @constructor
 */
var ChannelDispatcher = function(channel, config) {
  this.channel = channel;
  this.config = config;

  this.feedbackHandler = null;
};


/**
 * Dispatch a notification to the supplied deviceIds
 * @param deviceIds An array of ids for clients to send the notification to.
 * @param notification The notification to send to clients.
 */
ChannelDispatcher.prototype.dispatch = function(deviceIds, notification) {
  // Should be overridden by subclasses
};


/**
 * Register a handler function to deal with feedback from the channel's service.
 * @param feedbackHandler
 */
ChannelDispatcher.prototype.registerChannelFeedbackHandler = function(feedbackHandler) {
  this.feedbackHandler = feedbackHandler;
};


module.exports = ChannelDispatcher;
