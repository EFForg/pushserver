/**
 * Controller for the push notification form.
 */


var PushNotificationFormController = function($scope, $timeout, pushServerAPI, pushServerValidation) {

  var pushServerSettings = require('../../build/pushServerSettings');
  var supportedChannels = pushServerSettings['SUPPORTED_CHANNELS'];

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
    channels: _.cloneDeep(supportedChannels)
  };

  pushServerValidation.supportedChannels = _.cloneDeep(supportedChannels);

  $scope.formatDeviceIds = function(newValue) {
    var deviceIds = _.map(newValue.split('\n'), function(val) {
      return val.trim();
    });

    $scope.notification.deviceIds = _.filter(deviceIds, function(val) {
      return _.isString(val) && val !== '';
    });
  };

  var validateNotificationPromise;
  $scope.validateNotification = function(newValue) {
    if (!$scope.pushNotificationForm.$pristine) {
      $timeout.cancel(validateNotificationPromise);

      // Accumulate notification changes made < 350ms apart
      validateNotificationPromise = $timeout(function() {
        pushServerValidation.validateNotification(newValue, function(errorMessages) {
          pushServerValidation.resetFormValidity($scope.pushNotificationForm, errorMessages);
        });
      }, 350);
    }
  };

  $scope.$watch('workingModel.deviceIds', $scope.formatDeviceIds);
  $scope.$watch('notification', $scope.validateNotification, true);
};

module.exports = PushNotificationFormController;
