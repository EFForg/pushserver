/**
 * Route definitions for the subscription routes.
 */

var routeUtils = require('../utils');
var validation = require('./validation');


var subscriptionRoutes = [

  {
    method: 'POST',
    path: routeUtils.makePrefixedPath('subscriptions'),
    handler: require('./add_subscription'),
    config: {
      validate: {
        payload: function(value, options, next) {
          validation.validateSubscriptions(value, function(err) {
            next(err, value);
          });
        }
      }
    }
  },

  {
    method: 'DELETE',
    path: routeUtils.makePrefixedPath('subscriptions/{deviceId}'),
    handler: require('./delete_subscription')
  }

];


module.exports = subscriptionRoutes;
