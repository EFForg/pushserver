/**
 * Sends a test notification.
 */

var config = require('config');
var firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: config.CREDENTIALS.FCM.PROJECT_ID,
    clientEmail: config.CREDENTIALS.FCM.CLIENT_EMAIL,
    privateKey: config.CREDENTIALS.FCM.PRIVATE_KEY.replace(/\\n/g, "\n")
  }),
  databaseURL: config.CREDENTIALS.FCM.DATABASE_URL
});

var registrationIds = [];
var topic = null;

var gcmMessage = {
  data: {
    message: 'this is a test message',
    title: 'this is a test message title',
    url: 'https://www.google.com'
  }
};

if (topic) {
  firebase.messaging().sendToTopic(topic, gcmMessage)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}

if (registrationIds.length) {
  firebase.sendToDevice(registrationIds, gcmMessage)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}
