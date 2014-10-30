/**
 * Route handlers for all notification routes.
 */

var async = require('async');
var config = require('config');
var hapi = require('hapi');
var lodash = require('lodash');

var models = require('../db/models');
var routeUtils = require('./route_utils');
var utils = require('./notifications_utils');

var addNotification = function(request, reply) {

  var notification = utils.notificationFromPayload(request.payload);

  models.Notifications
    .build(notification)
    .save()
    .on('success', function(notification) {
      var locationURL = routeUtils.makePrefixedPath('/notifications/' + notification.notificationId);

      var externalNotification = notification.externalize();
      utils.fetchDeviceIdsForChannels(
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
    .on('error', function(err) {
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
