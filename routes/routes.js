/**
 * Routing file for handling inbound requests.
 */

var joi = require('joi');
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
      reply.view('index', APPLICATION_CONFIG);
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
    method: 'POST',
    // The query object used by datatables is complex enough it's a pain to stuff in query params,
    // so provide a pragmatic search endpoint
    path: makePrefixedPath('notifications', 'search'),
    handler: notifications.getNotifications
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
module.exports.routes = baseRoutes.concat(staticRoutes, notificationRoutes, subscriptionRoutes);
