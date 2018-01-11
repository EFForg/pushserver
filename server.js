/**
 * Core server implementation for the push server.
 */

var apn = require('apn');
var config = require('config');
var hapi = require('hapi');
var lodash = require('lodash');
var log4js = require('log4js');
var path = require('path');


var pushFeedback = require('./push_feedback');
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

// Required due to the way the tests + gulp tasks handle server instantiation.
server.registerPlugins = function(done) {
  // TODO(leah): Update routes to make API route registration a plugin. Requires moving the db
  //             + model instantiation to be plugin based too for meaningful separation, so not
  //             worth doing for now.

  var credentials = config.get('CREDENTIALS');
  var pushConfig = config.get('PUSH');
  var supportedChannels = config.get('SUPPORTED_CHANNELS');

  var plugins = {
    register: require('./plugins/push_dispatcher'),
    options: {
      channels: supportedChannels,
      channelConfig: {
        APNS: {
          key: credentials.get('APNS').get('KEY_FILE'),
          cert: credentials.get('APNS').get('CERT_FILE'),
          feedbackInterval: pushConfig.get('APNS_FEEDBACK_INTERVAL'),
          mode: config.get('MODE')
        },
        FCM: {
          projectId: credentials.get('FCM').get('PROJECT_ID'),
          clientEmail: credentials.get('FCM').get('CLIENT_EMAIL'),
          privateKey: credentials.get('FCM').get('PRIVATE_KEY'),
          databaseUrl: credentials.get('FCM').get('DATABASE_URL'),
          mode: config.get('MODE')
        }
      }
    }
  };

  server.register(plugins, function(err) {
    if (err) {
      throw err;
    }

    lodash.forEach(supportedChannels, function(channel) {
      var feedbackHandler = pushFeedback[channel];

      if (lodash.isUndefined(feedbackHandler)) {
        throw new Error('No feedback handler is available for ' + channel);
      } else {
        server.methods.registerChannelFeedbackHandler(channel, feedbackHandler);
      }
    });

    done();
  });

};

module.exports = server;
