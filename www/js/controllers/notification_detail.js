/**
 * Controller for the notification detail page.
 */

var angular = require('angular');

var PushNotificationDetailController = function(
  $scope, $state, $stateParams, toaster, pushServerAPI, notificationPreview, notificationFormatting) {

  $scope.notification = undefined;

  $scope.isPreview = $stateParams.notificationId === 'preview';

  /**
   * Shows a toast with details of the API error.
   * @param message
   */
  $scope.showAPIError = function(message) {
    toaster.pop(
      'error',
      message,
      'Please check your internet connection or contact the administrator',
      6000
    );
  };

  /**
   * Save the notification to the remote server.
   */
  $scope.submitNotification = function() {

    var success = function(data) {
      notificationPreview.setPreviewNotification(null);
      $state.go('notification', {notificationId: data.notificationId}, {location: 'replace'});
    };

    var error = function() {
      $scope.showAPIError('Unable to save notification');
    };

    pushServerAPI.postNotification($scope.notification, success, error);
  };

  /**
   * Re-attempts fetching the notification from the server.
   */
  $scope.getNotification = function() {
    var success = function(data) {
      $scope.notification = data;
    };

    var failure = function() {
      $scope.showAPIError('Unable to fetch notification');
    };

    pushServerAPI.getNotification($stateParams.notificationId, success, failure);
  };

  // If the user is previewing an existing notification, fetch it from the server, otherwise check
  // for the cached, previewable notification.
  if (!$scope.isPreview) {
    $scope.getNotification();
  } else {
    $scope.notification = notificationPreview.getPreviewNotification();
    // Do a redirect to the create notification page.
    if (angular.isUndefined($scope.notification) || $scope.notification === null) {
      $state.go('create_notification');
    }
  }

  /**
   * Returns a user-friendly string representing the channels the notification will go to.
   * @returns {string}
   */
  $scope.friendlyChannels = function() {
    var hasChannels = !angular.isUndefined($scope.notification) &&
      !angular.isUndefined($scope.notification.channels);

    var friendlyChannels = notificationFormatting.friendlyChannels(
      hasChannels ? $scope.notification.channels : []);

    var lastElem = friendlyChannels.pop();

    if (friendlyChannels.length > 0) {
      return friendlyChannels.join(', ') + ' and ' + lastElem;
    } else {
      return lastElem;
    }
  };

  /**
   * Returns a line break delimited string containing all device ids.
   */
  $scope.deviceIds = function() {
    var deviceIds = [];
    if (!angular.isUndefined($scope.notification) &&
        !angular.isUndefined($scope.notification.deviceIds)) {
      deviceIds = $scope.notification.deviceIds;
    }
    return deviceIds.join('\n');
  };

  /**
   * Returns the notification data object, with the URL field removed.
   *
   * This is because the FE presents URL as a top-level option, but to comply with the backend API
   * it's treated as a data key.
   */
  $scope.getNotificationData = function() {
    var data = {};
    if (!angular.isUndefined($scope.notification)) {
      angular.forEach($scope.notification.data, function(val, key) {
        if (key !== 'url') {
          data[key] = val;
        }
      });
    }

    return data;
  };

  var dataSkipKeys = [
    'stats',
    'state'
  ];

  /**
   * Fetches a copy of the notification with internal app state removed.
   */
  $scope.getUserFacingNotification = function() {
    var data = {};
    if (!angular.isUndefined($scope.notification)) {
      angular.forEach($scope.notification, function(val, key) {
        if (dataSkipKeys.indexOf(key) === -1) {
          data[key] = val;
        }
      });
    }

    return data;
  };

};

module.exports = PushNotificationDetailController;
