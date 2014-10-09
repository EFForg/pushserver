/**
 * Push Server API.
 */

var pushServerAPI = function ($http) {

  var pushServerSettings = require('../../build/pushServerSettings');
  var API_PREFIX = '/api/' + pushServerSettings['APPLICATION']['API_VERSION'];

  return {

    getNotification: function(notificationId, success, error) {
      var url = API_PREFIX + '/notifications/' + notificationId;
      $http.get(url).success(success).error(error);
    },

    getNotifications: function(limit, offset, success, error) {

    },

    postNotification: function(data, success, error) {
      var url = API_PREFIX + '/notifications';
      $http.post(url, data).success(success).error(error);
    },

    validateNotification: function(data, success, error) {
      var url = API_PREFIX + '/notifications/actions/validate';
      $http.post(url, data).success(success).error(error);
    }

  };

};

module.exports = pushServerAPI;
