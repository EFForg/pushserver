var path = require('path');

var APPLICATION_CONFIG = require('config').get('APPLICATION');
var API_PREFIX = '/api/' + APPLICATION_CONFIG.get('API_VERSION');

var makePrefixedPath = function() {
  var args = Array.prototype.slice.call(arguments);
  args.splice(0, 0, API_PREFIX);

  return path.join.apply(null, args);
};

module.exports.makePrefixedPath = makePrefixedPath;
