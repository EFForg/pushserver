/**
 * Controller for the push notification form.
 */

var PushNotificationFormController = function(
  $scope, $timeout, $state, pushFormHelpers, pushServerAPI, pushServerValidation) {

  var supportedChannels = require('../../build/pushServerSettings')['SUPPORTED_CHANNELS'];

  $scope.submitNotification = function() {

    var validationCb = function(formHasErrors) {
      if (!formHasErrors) {
        pushServerAPI.postNotification(
          $scope.notification,
          function(data, status, headers, config) {
            $state.go('notification', {notificationId: data.notificationId});
          },
          function(data, status, headers, config) {
            console.log(data);
            // TODO(leah): Review the err code and look at what comes back here...
          }
        );
      }
    };

    // Force a round of validation on all fields
    $scope.validateNotification($scope.workingModel.notification, true, validationCb);
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
    notification: angular.copy($scope.notification),
    deviceIds: '',
    channels: angular.copy(supportedChannels)
  };

  $scope.validateNotification = function(newValue, opt_forceSetError, opt_cb) {
    var validationComplete = function(errorMessages) {
      $scope.errorMessages = errorMessages;
      pushServerValidation.resetFormValidity(
        $scope.pushNotificationForm, errorMessages, opt_forceSetError);

      if (angular.isDefined(opt_cb)) {
        opt_cb(!angular.equals(errorMessages, {}));
      }

    };

    $scope.notification = pushFormHelpers.cleanNotificationForValidation(newValue);
    pushServerValidation.validateNotification($scope.notification, validationComplete);
  };

  $scope.$watch('workingModel.deviceIds', function(newValue) {
    $scope.notification.deviceIds = pushFormHelpers.formatDeviceIds(newValue);
  });

  var validateNotificationPromise;
  $scope.$watch(
    'workingModel.notification',
    function(newValue) {
      if (!$scope.pushNotificationForm.$pristine) {
        $timeout.cancel(validateNotificationPromise);

        // Accumulate notification changes made < 350ms apart
        validateNotificationPromise = $timeout(function() {
          $scope.validateNotification(newValue);
        }, 350);
      }
    },
    true);
};

module.exports = PushNotificationFormController;
