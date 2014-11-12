/**
 * Fetches a notification from the database.
 */

var hapi = require('hapi');

var models = require('../../db/models');


var getNotification = function(request, reply) {
  var notificationId = request.params.notificationId;

  models.Notifications
    .find({where: {notificationId: notificationId}})
    .on('success', function(notification) {
      console.log(notification.stats);
      reply(notification.externalize());
    })
    .on('error', function(err) {
      reply(hapi.error.notFound('notification not found for id: ' + notificationId));
    });
};


module.exports = getNotification;
