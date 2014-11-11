/**
 * Service to determine whether the user navigated back from the notification preview page.
 */

var notificationPreview = function ($rootScope) {

  var lastPageWasNotification = false;

  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
    if (!from.abstract) {
      lastPageWasNotification =
        from.name === 'notification' && fromParams.notificationId === 'preview';
    }
  });

  return {

    lastPageWasNotificationPreview: function() {
      return lastPageWasNotification;
    }

  };

};


module.exports = notificationPreview;
