/**
 *
 */

var APNSResponseLogger = function() {

};

APNSResponseLogger.prototype.handleTransmitted = function(notification, device) {
  logger.info(device + ' has been sent');
};


APNSResponseLogger.prototype.handleTransmissionError = function(notification, device) {
  logger.info(device + ' failed to transmit');
};


APNSResponseLogger.prototype.getResponseStats = function() {

};

module.exports = APNSResponseLogger;
