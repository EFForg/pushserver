/**
 * Adds a new notification to the database and enqueues it for delivery via configured channels.
 */

var hapi = require('hapi');

var models = require('../../db/models');
var notificationUtils = require('./utils');
var routeUtils = require('../utils');


var addNotification = function(request, reply) {

  var notification = notificationUtils.notificationFromPayload(request.payload);

  var success = function(notification) {
    var locationURL = routeUtils.makePrefixedPath('/notifications/' + notification.notificationId);

    var externalNotification = notification.externalize();
    notificationUtils.fetchDeviceIdsForChannels(
      externalNotification.channels,
      function(groupedSubscriptions) {
        request.server.methods.dispatchPushNotification(groupedSubscriptions, externalNotification, function() {
          // TODO(leah): Update the local DB to indicate the push notification has completed
          console.log('dispatch completed');
        });
      },
      function(error) {
        // TODO(leah): Update the notification to failed state
      }
    );

    reply(externalNotification)
      .code(201)
      .header('Location:' + locationURL);
  };

  models.Notifications
    .build(notification)
    .save()
    .on('success', success)
    .on('error', function(err) {
      reply(hapi.error.internal('unable to add the notification', err));
    });
};


module.exports = addNotification;
