/**
 * Push Server API.
 */

var angular = require('angular');

var pushServerAPI = function ($http, $filter) {

  var pushServerSettings = require('../../build/pushServerSettings');
  var API_PREFIX = '/api/' + pushServerSettings['APPLICATION']['API_VERSION'];

  return {

    makePrefixedUrl: function() {

      var cleanArgs = [API_PREFIX];
      // Trivial use case, hence nested loops
      angular.forEach(arguments, function(arg) {
        if (angular.isString(arg)) {
          angular.forEach(arg.split('/'), function(urlBit) {
            if (angular.isString(urlBit) && urlBit != '') {
             cleanArgs.push(urlBit);
            }
          });
        } else {
          cleanArgs.push(arg);
        }

      });

      return cleanArgs.join('/');
    },

    getNotification: function(notificationId, success, failure) {
      var url = this.makePrefixedUrl('notifications', notificationId);
      $http.get(url).success(success).error(failure);
    },

    postNotification: function(data, success, failure) {
      var url = this.makePrefixedUrl('notifications');
      $http.post(url, data).success(success).error(failure);
    }

  };

};

module.exports = pushServerAPI;
