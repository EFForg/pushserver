/**
 * Controller for the push notification form.
 */

var PushNotificationFormController = function($scope, pushServerAPI) {

  // Handle channel actions

  $scope.toggleSupportedChannel = function(channel) {
    var channelIndex = $scope.notification.channels.indexOf(channel);
    if (channelIndex !== -1) {
      $scope.notification.channels.splice(channelIndex, 1);
    } else {
      $scope.notification.channels.push(channel);
    }
  };

  $scope.submitNotification = function() {
    var isValid = true;
    var data = {};

    pushServerAPI.postNotification(
      data,
      function(data, status, headers, config) {
        // TODO(leah): Redirect the user to the notifications page showing the details of the notification that was just created
      },
      function(data, status, headers, config) {
        // TODO(leah): Show some kind of inline validation
      });
  };

  // NOTE: pushServerSettings is brought in via a build step, see gulpfile for details
  var channels = pushServerSettings['SUPPORTED_CHANNELS'];

  // Set up an initial empty notification
  $scope.notification = {
    title: '',
    message: '',
    sound: '',
    data: {},

    // admin variables
    channels: _.cloneDeep(channels),
    deviceIds: []
  };

  $scope.workingModel = {
    selectedChannels: _.zipObject(channels, _.map(channels, function() {
      return true;
    })),
    deviceIds: ''
  };

  $scope.$watch('workingModel.deviceIds', function(newValue, oldValue) {
    var deviceIds = _.map(newValue.split('\n'), function(val) {
      return val.trim();
    });

    $scope.notification.deviceIds = _.filter(deviceIds, function(val) {
      return _.isString(val) && val !== '';
    });
  });
};

module.exports = PushNotificationFormController;
