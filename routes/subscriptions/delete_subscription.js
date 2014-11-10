/**
 * Deletes a subscription from the database.
 */

var models = require('../../db/models');


var deleteSubscription = function(request, reply) {
  var deviceId = request.params.deviceId;

  var success = function(recordsDeleted) {
    if (recordsDeleted > 0) {
      reply({deviceId: deviceId, deleted: true});
    } else {
      reply({deviceId: deviceId, deleted: false}).code(404);
    }
  };

  var error = function() {
    // TODO(leah): Figure out how to deal with the 500
    // reply({deleted: false});
  };

  models.Subscriptions
    .destroy({where: {deviceId: deviceId}})
    .on('success', success)
    .on('error', error);
};


module.exports = deleteSubscription;
