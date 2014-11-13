/**
 * Fetches a notification from the database.
 */

var hapi = require('hapi');
var logger = require('log4js').getLogger('server');

var models = require('../../db/models');


var getNotification = function(request, reply) {
  var notificationId = request.params.notificationId;

  models.Notifications
    .find({where: {notificationId: notificationId}})
    .on('success', function(notification) {
      if (notification !== null) {
        reply(notification.externalize());
      } else {
        reply(hapi.error.notFound('notification not found for id: ' + notificationId));
      }
    })
    .on('error', function(err) {
      logger.error('unable to fetch notification for id %s, err:\n %s', notificationId, err);
      reply(hapi.error.internal('unable to fetch notification for id %s, err: %s', notificationId, err));
    });
};


module.exports = getNotification;
