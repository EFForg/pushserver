/**
 * Controller for the notification detail page.
 */

var angular = require('angular');

var PushNotificationDetailController = function(
  $scope, $state, $stateParams, toaster, pushServerAPI, notificationPreview) {

  var channelLookup = require('../../build/pushServerSettings')['CHANNEL_LOOKUP'];

  $scope.notification = undefined;

  $scope.isPreview = $stateParams.notificationId === 'preview';

  /**
   * Save the notification to the remote server.
   */
  $scope.submitNotification = function() {
    pushServerAPI.postNotification(
      $scope.notification,
      function(data, status, headers, config) {
        notificationPreview.setPreviewNotification(null);
        $state.go('notification', {notificationId: data.notificationId});
      },
      function(data, status, headers, config) {
        toaster.pop(
          'error',
          'Unable to save notification',
          'Please check your internet connection or contact the administrator',
          6000
        );
      }
    );
  };

  /**
   * Re-attempts fetching the notification from the server.
   */
  $scope.getNotification = function() {
    var success = function(data) {
      $scope.notification = data;
    };

    var failure = function(err) {
      toaster.pop(
        'error',
        'Unable to fetch notification',
        'Please check your internet connection or contact the administrator',
        6000
      );
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
    var friendlyChannels = [];
    if (!angular.isUndefined($scope.notification) &&
        !angular.isUndefined($scope.notification.channels)) {
      angular.forEach($scope.notification.channels, function(channel) {
        friendlyChannels.push(channelLookup[channel]);
      });
    }

    var lastElem = friendlyChannels.pop();
    return friendlyChannels.join(',') + !angular.isUndefined(lastElem) ? ' and ' + lastElem : '';
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
   */
  $scope.getNotificationData = function() {
    var data = {};
    if (!angular.isUndefined($scope.notification)) {
      angular.forEach($scope.notification.data, function(val, key) {
        data[key] = val;
      });
    }

    return data;
  };

};

module.exports = PushNotificationDetailController;
