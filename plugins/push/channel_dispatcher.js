/**
 * Channel specific dispatcher, responsible for sending notifications via the bound channel.
 */

/**
 * @constructor
 */
var ChannelDispatcher = function(channel, config) {

  /**
   * The name of the channel this dispatcher sends to.
   * @type {string}
   */
  this.channel = channel;

  /**
   * Configuration options for this channel.
   * @type {Object}
   */
  this.config = config;

  /**
   * Handler function for deregistering expired ids on this channel.
   * @type {function}
   */
  this.feedbackHandler = null;
};


/**
 * Dispatch a notification to the supplied deviceIds
 * @param deviceIds An array of ids for clients to send the notification to.
 * @param notification The notification to send to clients.
 * @param done
 */
ChannelDispatcher.prototype.dispatch = function(deviceIds, notification, done) {
  // Should be overridden by subclasses
};


/**
 * Register a handler function to deal with feedback from the channel's service.
 * @param {function} feedbackHandler
 */
ChannelDispatcher.prototype.registerChannelFeedbackHandler = function(feedbackHandler) {
  this.feedbackHandler = feedbackHandler;
};


ChannelDispatcher.prototype.getEmptyStatsObject = function() {
  return {
    idCount: 0,
    success: 0,
    unregistered: 0,
    failure: 0
  };
};

module.exports = ChannelDispatcher;
