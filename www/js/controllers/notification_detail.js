/**
 * Controller for the notification detail page.
 */

var PushNotificationDetailController = function($scope, $stateParams, pushServerAPI) {

  $scope.notification = undefined;

  var success = function(data) {
    $scope.notification = data;
  };

  var failure = function(err) {
    // TODO(leah): Show an error modal or butter bar entry
  };

  pushServerAPI.getNotification($stateParams.notificationId, success, failure);
};

module.exports = PushNotificationDetailController;
