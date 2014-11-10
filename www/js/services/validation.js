/**
 * Validation functionality for the push notification form
 */

var angular = require('angular');


var pushServerValidation = function () {

  // wrapper around the Joi validation used server-side
  var notificationValidation = require('../../../routes/notifications/validation');

  var supportedChannels = require('../../build/pushServerSettings')['SUPPORTED_CHANNELS'];

  return {

    /**
     * Resets the valid / error state on all fields in the supplied form.
     * @param pushNotificationForm The push form to reset.
     * @param errorMessages An object, keyed on field name, values of errors for that field
     * @param opt_forceSetError Whether to force-set error state even if the field is pristine.
     */
    resetFormValidity: function(pushNotificationForm, errorMessages, opt_forceSetError) {
      angular.forEach(pushNotificationForm, function (value, key) {
        if (angular.isObject(value) && value.hasOwnProperty('$modelValue')) {
          if (!value.$pristine || opt_forceSetError === true) {
            value.$setValidity('err', !angular.isDefined(errorMessages[key]));
          }
        }
      });
    },

    /**
     * Parses the Joi validation response to produce an easier to consume error object.
     * @param err The Joi validation object.
     * @returns {{}} An object, keyed on field name, value of error message.
     */
    parseJoiValidationMessage: function(err) {
      var errorMessages = {};
      if (err !== null) {
        for (var i = 0, fieldName; i < err.details.length; i++) {
          fieldName = err.details[i].path;
          errorMessages[fieldName] = err.details[i].message;
        }
      }

      return errorMessages;
    },

    /**
     * Validates the supplied notification using the Joi validation functionality.
     * @param notification The notification to validate.
     * @param callback The callback to call once validation completes.
     */
    validateNotification: function(notification, callback) {
      var onValidate = angular.bind(this, function(err) {
        var errorMessages = this.parseJoiValidationMessage(err);
        callback(errorMessages);
      });
      notificationValidation.validateNotification(supportedChannels, notification, onValidate);
    }

  };

};


module.exports = pushServerValidation;
