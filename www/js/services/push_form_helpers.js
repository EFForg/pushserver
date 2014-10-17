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

    formatDeviceIds: function(newValue) {
      var deviceIds = [];
      var rawDeviceIds = newValue.split('\n');

      for (var i = 0, rawDeviceId; i < rawDeviceIds.length; ++i) {
        rawDeviceId = rawDeviceIds[i].trim();
        if (angular.isString(rawDeviceId) && rawDeviceId !== '') {
          deviceIds.push(rawDeviceId);
        }
      }

      return deviceIds;
    }

  };

};

module.exports = pushFormHelpers;
