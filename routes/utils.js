/**
 * Utility functions for working with route definitions.
 */

var path = require('path');

var API_PREFIX = '/api/' + require('config').get('APPLICATION').get('API_VERSION');


var makePrefixedPath = function() {
  var args = Array.prototype.slice.call(arguments);
  args.splice(0, 0, API_PREFIX);

  return path.join.apply(null, args);
};

module.exports.makePrefixedPath = makePrefixedPath;
