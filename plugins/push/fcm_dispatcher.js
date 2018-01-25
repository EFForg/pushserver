/**
 * Dispatcher to send notifications to clients via FCM.
 */

var firebase = require('firebase-admin');
var config = require('config');

var FCMDispatcher = function() {};

if (config.MODE != 'test') {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: config.CREDENTIALS.FCM.PROJECT_ID,
      clientEmail: config.CREDENTIALS.FCM.CLIENT_EMAIL,
      privateKey: config.CREDENTIALS.FCM.PRIVATE_KEY.replace(/\\n/g, "\n")
    }),
    databaseURL: config.CREDENTIALS.FCM.DATABASE_URL
  });
}

/**
 * Sends a FCM message to the supplied topic
 *
 * @param {*} topic The FCM topic to which the message is sent
 * @param {*} notification The notification containing the message to be sent
 * @param {function} done The callback to call once send completes.
 */
FCMDispatcher.prototype.dispatchToTopic = function(topic, notification) {
  var payload = {
    data: {
      title: notification.title,
      message: notification.message,
      url: notification.data.url
    }
  };

  return firebase.messaging().sendToTopic(topic, payload);
};


module.exports = new FCMDispatcher();
