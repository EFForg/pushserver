/**
 * Tests for the validation functions.
 */

var assert = require('assert');
var lodash = require('lodash');

var notificationValidation = require('../../routes/notifications/validation');

var SUPPORTED_CHANNELS = require('config').get('SUPPORTED_CHANNELS');


describe('NotificationValidation', function() {

    // TODO(leah): Come back to this once I've figured out what constraints to place on the object
    //    var notificationSchema = Joi.object().keys({
    //      // Support an abbreviated version of the full push options
    //      title: Joi.string(),    // the message title, unused for iOS where the app name is used instead by default
    //      message: Joi.string(),  // the message body
    //      sound: Joi.string(),    // the name of a sound file to play, this file must be on the device (iOS only)
    //      data: Joi.object(),     // a bundle of key / value pairs to include in the notification
    //
    //      // admin variables
    //      channels: Joi.string().valid(supportedChannels).default(supportedChannels), // the channel(s) (FCM, APNS) to send to
    //      mode: Joi.string().valid(['prod', 'sandbox']).default('prod'),  // the notification mode, if it's sandbox, the notification will be processed but not sent
    //      deviceIds: Joi.array().includes(Joi.string())   // an array of deviceIds to send the notification to. If not supplied, the server will notify all deviceIds in the database
    //    });

    var validNotification = {
      title: 'title',
      message: 'message',
      sound: 'empty',
      data: {}
    };

    it('should return an error for a notification with invalid channels', function(done) {
      var invalidChannelsNotification = lodash.cloneDeep(validNotification);
      invalidChannelsNotification.channels = ['invalid'];
      notificationValidation.validateNotification(SUPPORTED_CHANNELS, invalidChannelsNotification, function(err) {
        assert.equal(
          err.toString(),
          'ValidationError: channels position 0 fails because value must be one of ' + SUPPORTED_CHANNELS.join(', ')
        );
        done();
      });
    });

    it('should return an error for a notification with no channels', function(done) {
      var emptyChannelsNotification = lodash.cloneDeep(validNotification);
      emptyChannelsNotification.channels = [];
      notificationValidation.validateNotification(SUPPORTED_CHANNELS, emptyChannelsNotification, function(err) {
        assert.equal(err.toString(), 'ValidationError: channels must contain at least 1 items');
        done();
      });
    });
});
