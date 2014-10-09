/**
 * Route handlers for all notification routes.
 */

var hapi = require('hapi');

var models = require('../db/models');
var validateNotification = require('../validation/notifications').validateNotification;

var addNotification = function(request, reply) {
  models.Notifications
    .build(request.payload)
    .save()
    .on('success', function(notification) {
      // TODO(leah): Update this to pass through a location header
      reply(notification.externalize()).code(201);
    })
    .on('error', function(err) {
      hapi.error.internal('unable to add the notification', err);
    });
};


var getNotification = function(request, reply) {
  var notificationId = request.params.notificationId;
  models.Notifications
    .find({where: {notificationId: notificationId}})
    .on('success', function(notification) {
      reply(notification.externalize());
    })
    .on('error', function() {
      hapi.error.notFound('notification not found for id: ' + notificationId);
    });
};


var getNotifications = function(request, reply) {

};


var validateNotification = function(request, reply) {
  var isValid = validateNotification(reply.payload);

  reply({isValid: true, validationErrors: [], validationMessage: ''});
};

module.exports.addNotification = addNotification;
module.exports.getNotification = getNotification;
module.exports.getNotifications = getNotifications;
module.exports.validateNotification = validateNotification;
