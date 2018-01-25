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
  };

};


module.exports = notificationPreview;
