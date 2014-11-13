/**
 * Logs a client-side error to disk.
 *
 * EFF has a strict privacy policy that precludes using standard err reporting. To give us a shot
 * at acting on application errors, this handler captures application stack traces and logs them to
 * disk.
 */

var logger = require('log4js').getLogger('client');


var logError = function(request, reply) {
  var trace = request.payload.trace;
  logger.error(trace);

  reply();
};


module.exports = logError;
