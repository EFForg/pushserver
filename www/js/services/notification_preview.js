/**
 * Cross-controller store for preview notifications data.
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
