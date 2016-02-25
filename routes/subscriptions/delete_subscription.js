/**
 * Deletes a subscription from the database.
 */

var hapi = require('hapi');
var lodash = require('lodash');
var logger = require('log4js').getLogger('server');

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

  var error = function(err) {
    logger.error('unable to delete subscription id %s, err:\n%s', deviceId, err);
    reply(hapi.error.internal('unable to delete subscription id %s, err: %s', deviceId, err));
  };

  // The Sequelize destroy() call doesn't support the field attribute, so pull out the db field
  // name of the deviceId field and reference it directly.
  var whereClause = lodash.zipObject([models.Subscriptions.attributes.deviceId.field], [deviceId]);
  models.Subscriptions
    .destroy({where: whereClause})
    .then(success, error);
};


module.exports = deleteSubscription;
