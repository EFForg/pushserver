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

      // URL is presented as a top-level option in the frontend, but treated as a data key for the
      // purposes of the backend.
      cleanNotification.data.url = cleanNotification.url;
      delete cleanNotification.url;

      return cleanNotification;
    },

    /**
     * Converts the raw \n delimited deviceIds string to an array of individual deviceIds.
     */
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
