/**
 * Base application definition for the Push Notification App.
 */

var angular = require('angular');

var pushNotificationApp = angular.module('PushNotificationApp', ['ui.router', 'datatables']);
pushNotificationApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
});

pushNotificationApp.controller('PushServerController', require('./controllers/push_server'));
pushNotificationApp.controller(
  'PushNotificationFormController', require('./controllers/notification_form'));
pushNotificationApp.controller(
  'PushNotificationListController', require('./controllers/notification_list'));
pushNotificationApp.controller(
  'PushNotificationDetailController', require('./controllers/notification_detail'));

pushNotificationApp.directive('pushNotificationChannels', require('./directives/channels'));
pushNotificationApp.directive('pushNotificationData', require('./directives/notification_data'));

pushNotificationApp.factory('pushServerValidation', require('./services/validation'));
pushNotificationApp.factory('pushServerAPI', require('./services/api'));
pushNotificationApp.factory('pushFormHelpers', require('./services/push_form_helpers'));

// Require in the cached templates - see gulp/tasks/ng_templates.js for details
require('../build/pushNotificationTemplates');


pushNotificationApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/create_notification');

  $stateProvider
    .state('create_notification', {
      url: '/create_notification',
      templateUrl: 'ng_partials/new_notification/push_form.html'
    })
    .state('notification', {
      url: '/notification/:notificationId',
      templateUrl: 'ng_partials/list/notification_detail.html'
    })
    // TODO(leah): Figure out passing limit / offset, search etc.
    .state('notifications', {
      url: '/notifications',
      templateUrl: 'ng_partials/list/notification_list.html'
    });

});
