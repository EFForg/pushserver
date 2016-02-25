/**
 * Adds a new notification to the database and enqueues it for delivery via configured channels.
 */

var hapi = require('hapi');
var logger = require('log4js').getLogger('server');

var models = require('../../db/models');
var notificationUtils = require('./utils');
var routeUtils = require('../utils');


var addNotification = function(request, reply) {

  var notification = notificationUtils.notificationFromPayload(request.payload);

  var success = function(notification) {
    var locationURL = routeUtils.makePrefixedPath('/notifications/' + notification.notificationId);

    var externalNotification = notification.externalize();
    notificationUtils.sendNotification(
      externalNotification, request.server.methods.dispatchPushNotification);

    reply(externalNotification)
      .code(201)
      .header('Location:' + locationURL);
  };

  models.Notifications
    .build(notification)
    .save()
    .then(success, function(err) {
      logger.error('unable to add notification %s, error: %s', notification, err);
      reply(hapi.error.internal('unable to add the notification', err));
    });
};


module.exports = addNotification;
