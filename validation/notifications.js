/**
 * JSON schema and validations for the notifications object.
 */

var Joi = require('joi');

var supportedChannels = require('config').get('SUPPORTED_CHANNELS');
var validationUtils = require('./utils');

var notificationSchema = Joi.object().keys({
  // Support an abbreviated version of the full push options
  title: Joi.string(),    // the message title, unused for iOS where the app name is used instead by default
  message: Joi.string(),  // the message body
  sound: Joi.string(),    // the name of a sound file to play, this file must be on the device (iOS only)
  data: Joi.object(),     // a bundle of key / value pairs to include in the notification

  // admin variables
  channels: Joi.string().valid(supportedChannels).default(supportedChannels), // the channel(s) (GCM, APNS) to send to
  mode: Joi.string().valid(['prod', 'sandbox']).default('prod'),  // the notification mode, if it's sandbox, the notification will be processed but not sent
  deviceIds: Joi.array().includes(Joi.string())   // an array of deviceIds to send the notification to. If not supplied, the server will notify all deviceIds in the database
});

var validateNotification = function(data, callback) {
  var options = {abortEarly: false, allowUnknown: false};
  Joi.validate(data, notificationSchema, options, function(err, value) {
    if (err === null) {
      callback(err, data);
    } else {
      callback(validationUtils.formatJoiValidationMessage(err));
    }
  });
};

module.exports.validateNotification = validateNotification;
