/**
 * Sends a test notification.
 */

var config = require('config');

var GCMDispatcher = require('../plugins/push/apns_dispatcher');

var credentials = config.get('CREDENTIALS');
var gcmCreds = {
  projectId: credentials.get('GCM').get('PROJECT_ID'),
  apiKey: credentials.get('GCM').get('API_KEY'),
  mode: config.get('MODE')
}

var gcmPushDispatcher = new GCMDispatcher(gcmCreds);

var registrationIds = [
  'ENTER_A_REGISTRATION_ID'
];
var gcmMessage = {
  dry_run: false,
  data: {
    message: 'this is a test message',
    title: 'this is a test message title',
    url: 'https://www.google.com'
  }
};
var done = function() {
  console.log('message sent!');
};

gcmPushDispatcher.dispatch(registrationIds, gcmMessage, done);
