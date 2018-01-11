/**
 * Feedback handler functions for supported channels.
 */

var lodash = require('lodash');
var logger = require('log4js').getLogger('server');

var db = require('./db/db');
var models = require('./db/models');

// @todo Figure out why this SELECT query logs that it deleted something.
var deleteQuery = "SELECT subscription_id FROM subscriptions WHERE channel = ? AND device_id LIKE ?";

var deleteSubscription = function(channel, registrationId) {
  db.query(deleteQuery, {raw: true, replacements: [channel, registrationId]})
    .then(function (res) {
      if (res.length > 0) {
        logger.info(
          'deleted subscription with id %s, device_id %s', res[0]['subscription_id'], registrationId);
      } else {
        logger.info('no subscription matching device_id %s found', registrationId);
      }
    })
    .catch(function (err) {
      logger.error('unable to delete subscription with id %s, err:\n%s', registrationId, err);
    });
};


var removeSubscription = function(channel, registrationIds) {
  lodash.forEach(registrationIds, function(registrationId) {
    deleteSubscription(channel, registrationId);
  });
};


var feedbackHandlers = {
  FCM: lodash.partial(removeSubscription, 'FCM'),
  APNS: lodash.partial(removeSubscription, 'APNS')
};


module.exports = feedbackHandlers;
