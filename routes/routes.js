/**
 * Routing file for handling inbound requests.
 */

var path = require('path');

var notifications = require('./notifications');
var subscriptions = require('./subscriptions');
var notificationValidation = require('../validation/notifications');
var subscriptionValidation = require('../validation/subscriptions');

var APPLICATION_CONFIG = require('config').get('APPLICATION');
var API_PREFIX = '/api/' + APPLICATION_CONFIG.get('API_VERSION');
var SUPPORTED_CHANNELS = require('config').get('SUPPORTED_CHANNELS');

var makePrefixedPath = function() {
  var args = Array.prototype.slice.call(arguments);
  args.splice(0, 0, API_PREFIX);

  return path.join.apply(null, args);
};

var baseRoutes = [

  {
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
      return reply.redirect('/create_notification');
    }
  }

];

var staticRoutes = [

  {
    method: 'GET',
    path: '/static/{filename}',
    handler: {
      directory: {
        path: '.',
        listing: false,
        index: false
      }
    }
  }

];

var templateRoutes = [

  {
    method: 'GET',
    path: '/create_notification',
    handler: function (request, reply) {
      reply.view('index', APPLICATION_CONFIG);
    }
  }

];

var notificationRoutes = [

  {
    method: 'POST',
    path: makePrefixedPath('notifications'),
    handler: notifications.addNotification,
    config: {
      validate: {
        payload: function(value, options, next) {
          notificationValidation.validateNotification(SUPPORTED_CHANNELS, value, function(err) {
            next(err, value);
          });
        }
      }
    }
  },

  {
    method: 'GET',
    path: makePrefixedPath('notifications/{notificationId}'),
    handler: notifications.getNotification
  },

  {
    method: 'GET',
    path: makePrefixedPath('notifications'),
    handler: notifications.getNotifications
  },

  {
    method: 'POST',
    path: makePrefixedPath('notifications/actions/validate'),
    handler: notifications.validateNotification
  }

];

var subscriptionRoutes = [

  {
    method: 'POST',
    path: makePrefixedPath('subscriptions'),
    handler: subscriptions.addSubscription,
    config: {
      validate: {
        payload: function(value, options, next) {
          subscriptionValidation.validateSubscriptions(value, function(err) {
            next(err, value);
          });
        }
      }
    }
  },

  {
    method: 'DELETE',
    path: makePrefixedPath('subscriptions/{deviceId}'),
    handler: subscriptions.deleteSubscription
  }

];

module.exports.makePrefixedPath = makePrefixedPath;
module.exports.routes = baseRoutes.concat(
  staticRoutes, templateRoutes, notificationRoutes, subscriptionRoutes);
