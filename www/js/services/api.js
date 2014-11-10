/**
 * Push Server API service.
 */

var angular = require('angular');


var pushServerAPI = function ($http) {

  var pushServerSettings = require('../../build/pushServerSettings');
  var API_PREFIX = '/api/' + pushServerSettings['APPLICATION']['API_VERSION'];

  return {

    /**
     * Creates a URL with the appropriate API server prefix applied.
     */
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

    /**
     * Gets a notification object from the server.
     */
    getNotification: function(notificationId, success, failure) {
      var url = this.makePrefixedUrl('notifications', notificationId);
      $http.get(url).success(success).error(failure);
    },

    /**
     * Adds a notification object to the server.
     */
    postNotification: function(data, success, failure) {
      var url = this.makePrefixedUrl('notifications');
      $http.post(url, data).success(success).error(failure);
    }

  };

};


module.exports = pushServerAPI;
