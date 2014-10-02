/**
 * Base application definition for the Push Notification App.
 */

require('../templates/templates');

var pushNotificationApp = angular.module('PushNotificationApp', ['pushNotification.templates']);
pushNotificationApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
});

pushNotificationApp.controller('PushNotificationFormController', require('./form_controller'));
pushNotificationApp.directive('pushNotificationData', require('./notification_data'));
pushNotificationApp.factory('pushServerAPI', require('./api'));
