/**
 * Core server implementation for the push server.
 */

var apn = require('apn');
var hapi = require('hapi');
var path = require('path');

var pushUtils = require('./push_utils');
var serverConfig = require('config').get('SERVER');

var db = require('./db/db');

var defaultOptions = {
  files: {
    relativeTo: path.join(__dirname, 'www', 'release')
  },
  views: {
    basePath: path.join(__dirname, 'www'),
    engines: {
      'html': {
        module: require('handlebars'),
        compileMode: 'sync'
      }
    },
    compileMode: 'async',
    isCached: serverConfig.get('CACHE_TEMPLATES')
  }
};

var server = new hapi.Server(serverConfig.URL, serverConfig.PORT, defaultOptions);
server.route(require('./routes/routes').routes);

var options = {
  cert: '',
  key: ''
};

pushUtils.configurePushServices();

module.exports = server;
