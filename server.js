/**
 * Core server implementation for the push server.
 */

var apn = require('apn');
var config = require('config');
var hapi = require('hapi');
var lodash = require('lodash');
var log4js = require('log4js');
var path = require('path');


var serverConfig = config.get('SERVER');

var db = require('./db/db');

var distDir = path.join(__dirname, 'www', 'dist');

var defaultOptions = {
  connections: {
    routes: {
      files: {
        relativeTo: distDir
      }
    }
  }
};

log4js.configure(config.get('LOGGING'));

var server = new hapi.Server(defaultOptions);
server.connection({ port: serverConfig.PORT, uri: serverConfig.URL });
server.register(require('inert'), () => {});
server.register(require('vision'), (err) => {
  server.views({
    relativeTo: distDir,
    engines: {
      html: require('handlebars')
    },
    isCached: serverConfig.get('CACHE_TEMPLATES'),
    partialsPath: path.join(__dirname, 'www/dist/templates')
  });
  server.route(require('./routes/routes').routes);
});

module.exports = server;
