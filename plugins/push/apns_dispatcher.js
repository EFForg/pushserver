/**
 * Dispatcher to send notifications to clients via APNS.
 */

var apn = require('apn');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');
var util = require('util');

var ChannelDispatcher = require('./channel_dispatcher');
// Default to a 2 hour expiry
var DEFAULT_NOTIFICATION_EXPIRY = Math.floor(Date.now() / 1000) + (60 * 60 * 2);


var APNSDispatcher = function(config) {
  ChannelDispatcher.call(this, 'APNS', config);

  /**
   * Object defining the configuration vars to use with the APN connection and feedback service.
   * @type {*}
   */
  this.config = config;

  /**
   * The underlying connection to the APNS servers.
   */
  this.apnConnection_ = this.getConnection_(this.config);

  this.configureFeedbackService_(this.config);
};

util.inherits(APNSDispatcher, ChannelDispatcher);


/**
 * Register the feedback handler and clear any buffered feedback notifications.
 * @param feedbackHandler
 */
APNSDispatcher.prototype.registerChannelFeedbackHandler = function(feedbackHandler) {
  APNSDispatcher.super_.prototype.registerChannelFeedbackHandler.call(this, feedbackHandler);

  // TODO(leah): No idea what this is supposed to do?
  lodash.forEach(this.feedbackBuffer_, this.feedbackHandler);
};


APNSDispatcher.prototype.dispatch = function(notificationIds, notification, done) {
  APNSDispatcher.super_.prototype.dispatch.call(this, notificationIds, notification);

  var note = new apn.Notification(notification.payload);

  note.expiry = DEFAULT_NOTIFICATION_EXPIRY;
  note.badge = notification.badge;
  note.sound = notification.sound;
  note.alert = notification.alert;

  this.apnConnection_.pushNotification(note, notificationIds);

  // Notification stats tracking isn't implemented as the EFF app isn't going to be released on
  // iOS. To get this fully working, these TODOs need to be resolved:
  //   * track when the notification has been processed by node-apn, so that the callback can fire
  //   * track the success / failure on the requests
  done(null, this.getEmptyStatsObject());
};


/**
 * Configure the APNS feedback service.
 * @param options An object describing the options to use for feedback.
 * @private
 */
APNSDispatcher.prototype.configureFeedbackService_ = function(options) {

  var options = {
    key: options.key,
    cert: options.cert,
    batchFeedback: true,
    interval: options.feedbackInterval
  };

  var feedback = new apn.Feedback(options);
  feedback.on('feedback', this.handleAPNSFeedback_);
};


/**
 * Internal handler for APNS feedback.
 * @param notificationIds An array of notification IDs returned by the feedback service to prune.
 * @private
 */
APNSDispatcher.prototype.handleAPNSFeedback_ = function(notificationIds) {
  if (this.feedbackHandler_ !== null) {
    lodash.forEach(notificationIds, function(notificationId) {
      this.feedbackHandler_(notificationId);
    });
  }
};


/**
 * Creates a new APNS connection and response logger.
 * @param function() done The function to call once notifications complete.
 */
APNSDispatcher.prototype.getConnection_ = function(options) {
  var options = {
    key: options.key,
    cert: options.cert,
    production: options.mode === 'production'
  };

  return new apn.connection(options);
};


module.exports = APNSDispatcher;
