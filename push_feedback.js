/**
 * Feedback handler functions for supported channels.
 */

var lodash = require('lodash');
var logger = require('log4js').getLogger('server');

var db = require('./db/db');
var models = require('./db/models');

var deleteQuery = "SELECT subscription_id FROM subscriptions WHERE channel = ? AND device_id LIKE ?";


var deleteSubscription = function(channel, registrationId) {
  db.query(deleteQuery, null, {raw: true}, [channel, registrationId])
    .on('success', function(res) {
      if (res.length > 0) {
        logger.info(
          'deleted subscription with id %s, device_id %s', res[0]['subscription_id'], registrationId);
      } else {
        logger.info('no subscription matching device_id %s found', registrationId);
      }
    })
    .on('error', function(err) {
      logger.error('unable to delete subscription with id %s, err:\n%s', registrationId, err);
    });
};


var removeSubscription = function(channel, registrationIds) {
  lodash.forEach(registrationIds, function(registrationId) {
    deleteSubscription(channel, registrationId);
  });
};


var feedbackHandlers = {
  GCM: lodash.partial(removeSubscription, 'GCM'),
  APNS: lodash.partial(removeSubscription, 'APNS')
};


module.exports = feedbackHandlers;
