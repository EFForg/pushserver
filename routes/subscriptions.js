/**
 * Handlers for dealing with subscribing devices and deleting subscriptions.
 */

var models = require('../db/models');
var modelUtils = require('../db/model_utils');


module.exports.deleteSubscription = function(request, reply) {
  var deviceId = request.params.deviceId;

  var success = function(subscriptionDeleted) {
    if (subscriptionDeleted) {
      reply({deviceId: deviceId, deleted: true});
    } else {
      reply({deviceId: deviceId, deleted: false}).code(404);
    }
  };

  var error = function() {
    // TODO(leah): Figure out how to deal with the 500
    // reply({deleted: false});
  };

  modelUtils.deleteSubscription(deviceId, success, error);
};


module.exports.addSubscription = function(request, reply) {

  var error = function(error) {
    // TODO(leah): raise a 500
    console.log('ADD SUB ERROR: ' + error);
  };

  var success = function(res) {
    var instance = res[0];
    var initialized = res[1];

    if (initialized) {
      instance.save().on('success', function (newInstance) {
        reply(newInstance.externalize()).code(200);
      });
    } else {
      reply(instance.externalize()).code(201);
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
