/**
 * Controller for the notification list page.
 */

var angular = require('angular');

var PushNotificationListController = function(
  $scope, $state, pushServerAPI, DTOptionsBuilder, DTColumnBuilder) {

  $.fn.dataTableExt.sErrMode = 'throw';

  $scope.handleRowClicked = function(notificationId) {
    $state.go('notification', {notificationId: notificationId});
  };

  $scope.addRowClickedEvents = function(newRow, data) {
    // TODO(leah): Look at moving this logic somewhere else, adding events here like this isn't
    //             good practice.
    var elem = angular.element(newRow);
    elem.unbind('click');
    elem.bind('click', angular.bind(this, $scope.handleRowClicked, data.notificationId));

    return newRow;
  };

  $scope.datatableOptions = DTOptionsBuilder.newOptions()
    .withOption('ajax', {
        dataSrc: 'data',
        url: pushServerAPI.makePrefixedUrl('notifications', 'search'),
        type: 'POST'
    })
    .withOption('rowCallback', $scope.addRowClickedEvents)
    .withOption('serverSide', true)
    .withOption('lengthMenu', [15, 30, 50, 100])
    .withOption('iDisplayLength', 15)
    .withPaginationType('full_numbers')
    .withBootstrap();

  $scope.datatableColumns = [
    DTColumnBuilder.newColumn('notificationId').withTitle('Notification Id'),
    DTColumnBuilder.newColumn('title').withTitle('Title'),
    DTColumnBuilder.newColumn('channels').withTitle('Channels'),
    DTColumnBuilder.newColumn('mode').withTitle('Notification Mode')
  ];

};

module.exports = PushNotificationListController;
