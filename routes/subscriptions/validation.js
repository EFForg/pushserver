/**
 * JSON schema and validations for the subscription object.
 */

var Joi = require('joi');

var supportedChannels = require('config').get('SUPPORTED_CHANNELS');


var schema = Joi.object().keys({
  channel: Joi.string().valid(supportedChannels).required(),
  language: Joi.string().max(20).required(),
  deviceId: Joi.string().required()
});


var validateSubscriptions = function(data, callback) {
  var options = {abortEarly: false, allowUnknown: false};
  Joi.validate(data, schema, options, function(err, value) {
    callback(err);
  });
};


module.exports.validateSubscriptions = validateSubscriptions;
