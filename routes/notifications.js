/**
 * Route handlers for all notification routes.
 */

var async = require('async');
var hapi = require('hapi');
var lodash = require('lodash');

var models = require('../db/models');
var utils = require('./notifications_utils');

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
  var findCriteria = utils.getNotificationFindCriteria(request.payload);

  var getCount = function(done) {
    models.Notifications.count()
      .on('success', function(count) {
        done(null, count);
      })
      .on('error', function(err) {
        done(err, null);
      });
  };

  var getRows = function(done) {
    models.Notifications
      .findAndCountAll(findCriteria)
      .on('success', function(result) {
        done(null, result);
      })
      .on('error', function(err) {
        done(err, null);
      });
  };

  var queriesComplete = function(err, results) {

    if (err) {
      reply({error: err});
    } else {
      reply({
        draw: parseInt(request.payload.draw),
        recordsTotal: results.count,
        recordsFiltered: results.data.count,
        data: results.data.rows.map(function(row) {
          return row.externalize();
        })
      });
    }

  };

  async.parallel({count: getCount, data: getRows}, queriesComplete);
};


module.exports.addNotification = addNotification;
module.exports.getNotification = getNotification;
module.exports.getNotifications = getNotifications;
