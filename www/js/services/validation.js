/**
 * Validation functionality for the push notification form
 */

var angular = require('angular');

var pushServerValidation = function () {

  // wrapper around the Joi validation used server-side
  var notificationValidation = require('../../../validation/notifications');

  return {

    supportedChannels: [],

    resetFormValidity: function(pushNotificationForm, errorMessages) {
      angular.forEach(pushNotificationForm, function (value, key) {
        if (angular.isObject(value) && value.hasOwnProperty('$modelValue')) {
          value.$setValidity('err', !angular.isDefined(errorMessages[key]));
        }
      });
    },

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

    validateNotification: function(notification, callback) {
      var onValidate = angular.bind(this, function(err) {
        var errorMessages = this.parseJoiValidationMessage(err);
        callback(errorMessages);
      });
      notificationValidation.validateNotification(this.supportedChannels, notification, onValidate);
    }

  };

};

module.exports = pushServerValidation;
