/**
 * Push form helper functions.
 */

var angular = require('angular');


var pushFormHelpers = function () {

  return {

    /**
     * Clean up the notification object prior to passing it to validation.
     *
     * This is required as Joi has issues with validating empty strings vs. undefined values for
     * required fields, whereas ng binds an empty <input> as an empty string.
     *
     * @param rawNotification
     * @returns {{}}
     */
    cleanNotificationForValidation: function(rawNotification) {

      var cleanNotification = {};

      angular.forEach(rawNotification, function(value, key) {
        if (angular.isString(value) && value === '') {
          cleanNotification[key] = undefined;
        } else {
          cleanNotification[key] = value;
        }
      }, rawNotification);

      return cleanNotification;
    },

    /**
     * Creates an empty notification object.
     * @returns {{}}
     */
    makeEmptyNotification: function() {
      return {
        title: undefined,
        message: undefined,
        sound: undefined,
        data: {},

        // admin variables
        channels: []
      };
    },

    /**
     * Creates the working model for the push form.
     *
     * @param {{}} notification
     * @param {boolean} lastPageWasNotificationPreview
     * @param {Array.<string>} supportedChannels
     * @returns {{}}
     */
    getWorkingModel: function(notification, lastPageWasNotificationPreview, supportedChannels) {

      return {
        notification: angular.copy(notification),
        channels: angular.copy(supportedChannels),
        url: lastPageWasNotificationPreview ? notification.data.url : ''
      };
    }

  };

};


module.exports = pushFormHelpers;
