/**
 * Route definitions for the notification routes.
 */

var routeUtils = require('../utils');
var validation = require('./validation');

var SUPPORTED_CHANNELS = require('config').get('SUPPORTED_CHANNELS');


var notificationRoutes = [

  {
    method: 'POST',
    path: routeUtils.makePrefixedPath('notifications'),
    handler: require('./add_notification'),
    config: {
      validate: {
        payload: function(value, options, next) {
          validation.validateNotification(SUPPORTED_CHANNELS, value, function(err) {
            next(err, value);
          });
        }
      }
    }
  },

  {
    method: 'GET',
    path: routeUtils.makePrefixedPath('notifications/{notificationId}'),
    handler: require('./get_notification')
  },

  {
    method: 'POST',
    // The query object used by datatables is complex enough it's a pain to stuff in query params,
    // so provide a pragmatic search endpoint
    path: routeUtils.makePrefixedPath('notifications', 'search'),
    handler: require('./get_notifications')
  }

];


module.exports = notificationRoutes;
