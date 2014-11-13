/**
 * Fetches notifications matching the supplied search criteria from the database.
 */

var async = require('async');
var hapi = require('hapi');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');

var models = require('../../db/models');
var notificationUtils = require('./utils');


/**
 * Gets a count of all notifications in the database.
 *
 * @param done
 */
var getCount = function(done) {
  models.Notifications.count()
    .on('success', function(count) {
      done(null, count);
    })
    .on('error', function(err) {
      logger.error('unable to get a count of notification rows for getNotifications: %s', err);
      done(err, null);
    });
};


/**
 * Gets a count of rows matching the find criteria and the subset of rows within its limit / offset.
 *
 * @param findCriteria
 * @param done
 */
var getRows = function(findCriteria, done) {
  models.Notifications
    .findAndCountAll(findCriteria)
    .on('success', function(result) {
      done(null, result);
    })
    .on('error', function(err) {
      logger.error('unable to fetch rows and row count for getNotifications: %s', err);
      done(err, null);
    });
};


var getNotifications = function(request, reply) {
  var findCriteria = notificationUtils.getNotificationFindCriteria(request.payload);

  var queriesComplete = function(err, results) {

    if (err) {
      logger('unable to fetch notifications from the db: %s', err);
      reply(hapi.error.internal('unable to fetch notifications from the db: %s', err));
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

  async.parallel({
    count: getCount,
    data: lodash.bind(getRows, this, findCriteria)
  }, queriesComplete);
};


module.exports = getNotifications;
