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

  /**
   * Callback called when a new row is added to the datatable.
   * @param newRow The row element.
   * @param data The data associated with the new row.
   * @returns {*}
   */
  $scope.addRowClickedEvents = function(newRow, data) {
    // TODO(leah): Look at whether this can be handled via bubbling / top level click handler vs.
    //             adding (row_count) * individual events.
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
