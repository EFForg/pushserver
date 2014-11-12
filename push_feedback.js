/**
 * Feedback handler functions for supported channels.
 */

var lodash = require('lodash');
var logger = require('log4js').getLogger();

var models = require('./db/models');


// TODO(leah): Get this working.
var removeSubscription = function(channel, registrationIds) {
//  models.Subscriptions
//    .destroy({deviceId: registrationIds})
//    .on('success', function(affectedRows) {
//      logger.info('Deleted %s subscriptions', affectedRows);
//    })
//    .on('error', function(err) {
//      logger.error('Unable to delete registrationIds: %s, err:\n%s', registrationIds, err.toString());
//    });
};


var feedbackHandlers = {
  GCM: lodash.partial(removeSubscription, 'GCM'),
  APNS: lodash.partial(removeSubscription, 'APNS')
};


module.exports = feedbackHandlers;
