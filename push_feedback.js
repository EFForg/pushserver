/**
 * Feedback handler functions for supported channels.
 */


var feedbackHandlers = {
  GCM: function(registrationId) {

  },

  APNS: function(notificationId) {

//    var error = function(err) {
//      console.log(
//        'Unable to delete subscription to APNS with deviceId: ' + item.device + '\n err: ' + err);
//    };

    // modelUtils.deleteSubscription(item.device, null, error);

  }
};


module.exports = feedbackHandlers;
