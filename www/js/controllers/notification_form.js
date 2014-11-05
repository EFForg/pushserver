/**
 * Controller for the push notification form.
 */

var PushNotificationFormController = function(
  $scope, $timeout, $state, pushFormHelpers, notificationPreview, pushServerValidation) {

  var supportedChannels = require('../../build/pushServerSettings')['SUPPORTED_CHANNELS'];
  $scope.channelLookup = require('../../build/pushServerSettings')['CHANNEL_LOOKUP'];

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

  /**
   * Preview the new notification before submitting to the backend.
   */
  $scope.previewNotification = function() {

    var validationCb = function(formHasErrors) {
      if (!formHasErrors) {
        notificationPreview.setPreviewNotification($scope.notification);
        $state.go('notification', {notificationId: 'preview'});
      }
    };

    // Force validation on all fields
    $timeout.cancel(validateNotificationPromise);
    $scope.validateNotification($scope.workingModel.notification, true, validationCb);
  };

  /**
   * Wrapper function to validate the underlying notification.
   * @param newValue The new value for the $scope.notification object.
   * @param opt_forceSetError Whether to force set error state even if the field is pristine.
   * @param opt_cb Callback to call once validation completes.
   */
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

  // deviceIds comes back as a \n delimited string, this watch is used to break it up and pass a
  // clean array to the notification object.
  $scope.$watch('workingModel.deviceIds', function(newValue) {
    $scope.notification.deviceIds = pushFormHelpers.formatDeviceIds(newValue);
  });

  var validateNotificationPromise;

  /**
   * Watch function that accumulates changes to the notification before firing validation.
   * @param newValue The new value for the $scope.notification object.
   */
  var notificationValidationAccumulator = function(newValue) {
    if (!$scope.pushNotificationForm.$pristine) {
      $timeout.cancel(validateNotificationPromise);

      // Accumulate notification changes made < 350ms apart
      validateNotificationPromise = $timeout(function() {
        $scope.validateNotification(newValue);
      }, 350);
    }
  };

  $scope.$watch('workingModel.notification', notificationValidationAccumulator, true);
};

module.exports = PushNotificationFormController;
