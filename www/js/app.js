/**
 * Base application definition for the Push Notification App.
 */

var angular = require('angular');

var pushNotificationApp = angular.module('PushNotificationApp', []);
pushNotificationApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
});

pushNotificationApp.controller('PushNotificationFormController', require('./controllers/notification_form'));

pushNotificationApp.directive('pushNotificationChannels', require('./directives/channels'));
pushNotificationApp.directive('pushNotificationData', require('./directives/notification_data'));

pushNotificationApp.factory('pushServerValidation', require('./services/validation'));
pushNotificationApp.factory('pushServerAPI', require('./services/api'));
pushNotificationApp.factory('pushFormHelpers', require('./services/push_form_helpers'));

// Require in the cached templates - see gulp/tasks/ng_templates.js for details
require('../build/pushNotificationTemplates');
