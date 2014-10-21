/**
 * Controller for the notification list page.
 */

var PushNotificationListController = function(
  $scope, pushServerAPI, DTOptionsBuilder, DTColumnBuilder) {

  $.fn.dataTableExt.sErrMode = 'throw';

  $scope.datatableOptions = DTOptionsBuilder.newOptions()
    .withOption('ajax', {
        dataSrc: 'data',
        url: pushServerAPI.makePrefixedUrl('notifications', 'search'),
        type: 'POST'
    })
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withBootstrap();

  $scope.datatableColumns = [
    DTColumnBuilder.newColumn('notificationId').withTitle('Notification Id')
  ];

};

module.exports = PushNotificationListController;
