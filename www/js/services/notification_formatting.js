/**
 * Utility functions for formatting and rendering notification data.
 */

var angular = require('angular');

var notificationPreview = function () {

  var channelLookup = require('../../build/pushServerSettings')['CHANNEL_LOOKUP'];

  return {

    /**
     * @param {string} unfriendlyChannel The "unfriendly" channel, e.g. APNS.
     * @returns {string} The "friendly" channel, e.g. iOS
     */
    getFriendlyChannel: function(unfriendlyChannel) {
      return channelLookup[unfriendlyChannel];
    },

    /**
     * Returns an array of "friendly" channel names for the supplied channels, e.g iOS for APNS
     * @param channels
     * @returns {Array}
     */
    friendlyChannels: function(channels) {
      var friendlyChannels = [];
      angular.forEach(channels, function(channel) {
        friendlyChannels.push(channelLookup[channel]);
      });

      return friendlyChannels;
    },

    /**
     * Converts the raw \n delimited deviceIds string to an array of individual deviceIds.
     */
    formatDeviceIds: function(newValue) {
      var deviceIds = [];
      var rawDeviceIds = newValue.split('\n');

      for (var i = 0, rawDeviceId; i < rawDeviceIds.length; ++i) {
        rawDeviceId = rawDeviceIds[i].trim();
        if (angular.isString(rawDeviceId) && rawDeviceId !== '') {
          deviceIds.push(rawDeviceId);
        }
      }

      return deviceIds;
    }

  };

};


module.exports = notificationPreview;
