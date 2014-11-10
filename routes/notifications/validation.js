/**
 * JSON schema and validations for the notifications object.
 */

var Joi = require('joi');


var notificationSchema;

// Support lazy initialization of the notification schema. This is to remove the config dependency
// from this module, as its dependencies are not FE friendly.
var getNotificationSchema = function(supportedChannels) {
  if (notificationSchema === undefined) {
    var channelsIosOnlySchema = Joi.array().min(1).max(1).includes(Joi.string().valid('APNS'))

    notificationSchema = Joi.object().keys({
      // the message title, unused for iOS where the app name is used instead by default
      title: Joi.string().when(
        'channels',
        {
          is: channelsIosOnlySchema,
          then: Joi.optional(),
          otherwise: Joi.required()
        }
      ),
      message: Joi.string().required(),  // the message body
      sound: Joi.string(),    // the name of a sound file to play, this file must be on the device (iOS only)
      data: Joi.object(),     // a bundle of key / value pairs to include in the notification

      // admin variables
      channels: Joi.array().includes(Joi.string().valid(supportedChannels)).min(1).default(supportedChannels), // the channel(s) (GCM, APNS) to send to
      mode: Joi.string().valid(['prod', 'sandbox']).default('prod'),  // the notification mode, if it's sandbox, the notification will be processed but not sent
      deviceIds: Joi.array().includes(Joi.string())   // an array of deviceIds to send the notification to. If not supplied, the server will notify all deviceIds in the database
    });
  }

  return notificationSchema;
};


/**
 * Validates a notification object.
 *
 * @param supportedChannels The channels the push server supports publishing to.
 * @param data The notification object to validate.
 * @param callback
 */
var validateNotification = function(supportedChannels, data, callback) {
  var options = {abortEarly: false, allowUnknown: false};
  var schema = getNotificationSchema(supportedChannels);

  Joi.validate(data, schema, options, function(err, value) {
    callback(err);
  });
};


module.exports.validateNotification = validateNotification;
