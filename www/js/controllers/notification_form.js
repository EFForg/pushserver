/**
 * Controller for the push notification form.
 */


var PushNotificationFormController = function($scope, $timeout, pushServerAPI, pushServerValidation) {

  var supportedChannels = require('../../build/pushServerSettings')['SUPPORTED_CHANNELS'];

  $scope.submitNotification = function() {
    var data = {};

    pushServerAPI.postNotification(
      data,
      function(data, status, headers, config) {
        // TODO(leah): Redirect the user to the notifications page showing the details of the notification that was just created
      },
      function(data, status, headers, config) {
        // TODO(leah): Show some kind of inline validation
      }
    );
  };

  $scope.errorMessages = {};

  // Set up an initial empty notification
  $scope.notification = {
    title: undefined,
    message: undefined,
    sound: undefined,
    data: {},

    // admin variables
    channels: [],
    deviceIds: []
  };

  $scope.workingModel = {
    deviceIds: '',
    channels: angular.copy(supportedChannels)
  };

  $scope.formatDeviceIds = function(newValue) {
    var deviceIds = [];
    var rawDeviceIds = newValue.split('\n');

    for (var i = 0, rawDeviceId; i < rawDeviceIds.length; ++i) {
      rawDeviceId = rawDeviceIds[i].trim();
      if (angular.isString(rawDeviceId) && rawDeviceId !== '') {
        deviceIds.push(rawDeviceId);
      }
    }

    $scope.notification.deviceIds = [];
  };

  var validateNotificationPromise;
  $scope.validateNotification = function(newValue) {
    if (!$scope.pushNotificationForm.$pristine) {
      $timeout.cancel(validateNotificationPromise);

      // Accumulate notification changes made < 350ms apart
      validateNotificationPromise = $timeout(function() {
        var validationComplete = function(errorMessages) {
          pushServerValidation.resetFormValidity($scope.pushNotificationForm, errorMessages);
        };
        pushServerValidation.validateNotification(newValue, validationComplete);
      }, 350);
    }
  };

  $scope.$watch('workingModel.deviceIds', $scope.formatDeviceIds);
  $scope.$watch('notification', $scope.validateNotification, true);
};

module.exports = PushNotificationFormController;
