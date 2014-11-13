/**
 * Utility functions for formatting and rendering notification data.
 */

var angular = require('angular');

var notificationPreview = function () {

  var channelLookup = require('../../build/pushServerSettings')['CHANNEL_LOOKUP'];

  return {

    friendlyChannels: function(channels) {
      var friendlyChannels = [];
      angular.forEach(channels, function(channel) {
        friendlyChannels.push(channelLookup[channel]);
      });

      return friendlyChannels;
    },

    /**
     * Converts a URIjs object to a string, minus the scheme.
     *
     * @param uri The URIjs object to get the string form of.
     * @returns {String} The string form of the URI instance with the scheme and :// removed.
     */
    urlStringMinusScheme: function(uri) {
      var urlWithoutScheme = uri.clone().scheme('').toString();
      if (urlWithoutScheme === '/') {
        return '';
      } else if (urlWithoutScheme.indexOf('//') === 0) {
        return urlWithoutScheme.substring(2, urlWithoutScheme.length);
      } else {
        return urlWithoutScheme;
      }
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
