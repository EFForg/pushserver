/**
 * JSON schema and validations for the error routes.
 */

var Joi = require('joi');

var traceSchema = Joi.object().keys({
  trace: Joi.string().required()
});


var validateTrace = function(data, callback) {
  var options = {abortEarly: false, allowUnknown: false};
  Joi.validate(data, traceSchema, options, function(err, value) {
    callback(err);
  });
};


module.exports.validateTrace = validateTrace;
