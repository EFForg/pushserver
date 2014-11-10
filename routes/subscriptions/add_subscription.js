/**
 * Adds a new subscription to the database.
 */

var models = require('../../db/models');

var routeUtils = require('../utils');


var addSubscription = function(request, reply) {

  var error = function(error) {
    // TODO(leah): raise a 500
    console.log('ADD SUB ERROR: ' + error);
  };

  var success = function(res) {
    var instance = res[0];
    var initialized = res[1];

    if (initialized) {
      instance.save().on('success', function (newInstance) {
        var subscriptionURL = routeUtils.makePrefixedPath(
          '/subscriptions/' + newInstance.subscriptionId);
        reply(newInstance.externalize())
          .code(201)
          .header('Location:' + subscriptionURL);
      });
    } else {
      // kick back a 200 for easier client handling, technically should probably be a 302 / 303
      reply(instance.externalize()).code(200);
    }
  };

  var params = {
    where: {deviceId: request.payload.deviceId},
    defaults: request.payload
  };

  // NOTE: this is using findOrInitialize + a separate save as findOrCreate is throwing a spurious
  //       error under Sequelize 2.0.0-rc1
  models.Subscriptions
    .findOrInitialize(params)
    .on('success', success)
    .on('error', error);
};


module.exports = addSubscription;
