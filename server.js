/**
 * Core server implementation for the push server.
 */

var apn = require('apn');
var hapi = require('hapi');
var path = require('path');

var pushUtils = require('./push_utils');
var serverConfig = require('config').get('SERVER');

var db = require('./db/db');

var distDir = path.join(__dirname, 'www', 'dist');

var defaultOptions = {
  files: {
    relativeTo: distDir
  }
};

var server = new hapi.Server(serverConfig.URL, serverConfig.PORT, defaultOptions);
server.views({
  basePath: distDir,
  engines: {
    html: require('handlebars')
  },
  isCached: serverConfig.get('CACHE_TEMPLATES'),
  partialsPath: path.join(__dirname, 'www/dist/templates')
});
server.route(require('./routes/routes').routes);

var options = {
  cert: '',
  key: ''
};

pushUtils.configurePushServices();

module.exports = server;
