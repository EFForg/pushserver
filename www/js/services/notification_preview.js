/**
 * Simple factory for storing preview notifications between controllers.
 */

var notificationPreview = function () {

  var cachedNotification;

  return {

    setPreviewNotification: function(notification) {
      cachedNotification = notification;
    },

    getPreviewNotification: function() {
      return cachedNotification;
    }

  };

};


module.exports = notificationPreview;
