/**
 * Fetches a notification from the database.
 */

var boom = require('boom');
var hapi = require('hapi');
var logger = require('log4js').getLogger('server');
var models = require('../../db/models');

var getNotification = function(request, reply) {
  var notificationId = request.params.notificationId;

  models.Notifications
    .find({where: {notificationId: notificationId}})
    .then(function (notification) {
      if (notification !== null) {
        reply(notification.externalize());
      }
      else {
        reply(boom.badImplementation('notification not found', notificationId));
      }
    }, function (err) {
      logger.error('unable to fetch notification for id %s, err:\n %s', notificationId, err);
      reply(boom.badImplementation('unable to fetch notification', [notificationId, err]));
    });
};

module.exports = getNotification;
