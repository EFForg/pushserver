/**
 * Controller for the push notification data widget.
 */

var PushNotificationChannelsDirective = function() {

  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      pushNotificationChannels: '=',
      formField: '='
    },
    templateUrl: 'ng_partials/directives/channels.html',
    link: function(scope, elm, attrs, ctrl) {

      scope.dataModel = {
        channels: {},
        selectedChannels: [],
        channelHelpers: {
          'APNS': 'iOS',
          'GCM': 'Android'
        }
      };

      // Set up the data model
      for (var i = 0, channel; i < scope.pushNotificationChannels.length; i++) {
        channel = scope.pushNotificationChannels[i];
        scope.dataModel.channels[channel] = true;
        scope.dataModel.selectedChannels.push(channel);
      }

      scope.toggleSupportedChannel = function(channel) {
        ctrl.$pristine = false;

        var channelIndex = scope.dataModel.selectedChannels.indexOf(channel);
        if (channelIndex !== -1) {
          scope.dataModel.selectedChannels.splice(channelIndex, 1);
        } else {
          scope.dataModel.selectedChannels.push(channel);
        }

        ctrl.$setViewValue(scope.dataModel.selectedChannels);
      };

      scope.getChannelLabel = function(channel) {
        return scope.dataModel.channelHelpers[channel] || channel;
      };

      ctrl.$setViewValue(scope.pushNotificationChannels);
    }
  };

};

module.exports = PushNotificationChannelsDirective;

