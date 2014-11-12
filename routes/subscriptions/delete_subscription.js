/**
 * Deletes a subscription from the database.
 */

var lodash = require('lodash');

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

  // The Sequelize destroy() call doesn't appear to support the field attribute, so pull out the
  // db field name of the deviceId field and reference it directly.
  var whereClause = lodash.zipObject([models.Subscriptions.attributes.deviceId.field], [deviceId]);
  models.Subscriptions
    .destroy({where: whereClause})
    .on('success', success)
    .on('error', error);
};


module.exports = deleteSubscription;
