/**
 * Route definitions for the errors routes.
 */

var Joi = require('joi');

var routeUtils = require('../utils');
var validation = require('./validation');


var errorRoutes = [

  {
    method: 'POST',
    path: routeUtils.makePrefixedPath('errors'),
    handler: require('./log_error'),
    config: {
      validate: {
        payload: function(value, options, next) {
          validation.validateTrace(value, function(err) {
            next(err, value);
          });
        }
      }
    }
  }

];


module.exports = errorRoutes;
