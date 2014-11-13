/**
 * Controller for the push notification form.
 */

var URI = require('URI');
var angular = require('angular');

var supportedChannels = require('../../build/pushServerSettings')['SUPPORTED_CHANNELS'];


var PushNotificationFormController = function(
  $scope, $timeout, $state,
  pushFormHelpers, notificationPreview, notificationFormatting, stateHistory, pushServerValidation) {

  /**
   * Object, keyed on channel name, value of friendly name for that channel, e.g. APNS: iOS
   * @type {*}
   */
  $scope.channelLookup = require('../../build/pushServerSettings')['CHANNEL_LOOKUP'];

  /**
   * Object, keyed on form field name, value of error messages associated with that form.
   * @type {{}}
   */
  $scope.errorMessages = {};

  /**
   * The object representing the notification to send to the API for publishing.
   * @type {*}
   */
  $scope.notification = stateHistory.lastPageWasNotificationPreview() ?
    notificationPreview.getPreviewNotification() : pushFormHelpers.makeEmptyNotification();

  /**
   * The working model used by the form to store intermediate values and ephemeral data.
   * @type {{}}
   */
  $scope.workingModel = pushFormHelpers.getWorkingModel(
    $scope.notification, stateHistory.lastPageWasNotificationPreview(), supportedChannels);

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
   *
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


  // Watch functions

  // deviceIds comes back as a \n delimited string, this watch is used to break it up and pass a
  // clean array to the notification object.
  $scope.$watch('workingModel.deviceIds', function(newValue) {
    $scope.workingModel.notification.deviceIds = notificationFormatting.formatDeviceIds(newValue);
  });

  // URL is presented as a top-level option in the frontend, but treated as a data key for the
  // purposes of the backend.
  $scope.$watch('workingModel.url', function(newValue) {
    if (newValue.urlStringMinusScheme !== '') {
      $scope.workingModel.uri = new URI(newValue.urlStringMinusScheme);
      $scope.workingModel.uri.scheme(newValue.scheme);

      $scope.workingModel.notification.data['url'] = $scope.workingModel.uri.toString();
    } else {
      delete $scope.workingModel.notification.data['url'];
    }
  }, true);

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
