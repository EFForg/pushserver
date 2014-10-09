/**
 * Config options for all gulp tasks.
 */

var gutil = require('gulp-util');
var path = require('path');

var serverConfig = require('config').get('SERVER');

var BASE_DIR = path.join(__dirname, '..');
var COMPONENTS_DIR = path.join(BASE_DIR, 'bower_components');
var WWW_DIR = path.join(BASE_DIR, 'www');
var BUILD_DIR = path.join(WWW_DIR, 'build');
var DIST_DIR = path.join(WWW_DIR, 'dist');

module.exports = {

  appSettings: {
    dest: BUILD_DIR,
    fileName: 'pushServerSettings.js',
    settingsKeys: [
      'SUPPORTED_CHANNELS',
      'APPLICATION'
    ]
  },

  browserSync: {
    proxy: serverConfig.get('URL') + ':' + serverConfig.get('PORT'),
    files: [
      path.join(DIST_DIR, '/**/*'),
      '!' + path.join(DIST_DIR, '/**.map')
    ]
  },

  buildDir: DIST_DIR,

  browserify: {
    debug: !gutil.env.production,
    bundleConfigs: [{
      entries: './www/js/app.js',
      dest: DIST_DIR,
      outputName: 'push_server.min.js'
    }]
  },

  css: {
    dest: DIST_DIR,
    paths: path.join(WWW_DIR, 'css/*.css')
  },

  jsLibs: [
    path.join(COMPONENTS_DIR, 'jquery/dist/jquery.js'),
    path.join(COMPONENTS_DIR, 'angular/angular.js'),
    path.join(COMPONENTS_DIR, 'lodash/dist/lodash.compat.js'),
    path.join(COMPONENTS_DIR, 'bootstrap/dist/js/bootstrap.js')
  ],

  ngTemplates: {
    moduleTemplates: [{
      dest: BUILD_DIR,
      paths: [
        path.join(WWW_DIR, 'templates/new_notification/push_data.html'),
        path.join(WWW_DIR, 'templates/new_notification/channels.html')
      ],
      fileRoot: 'ng_partials',
      ngModuleName: 'PushNotificationApp',
      templateFileName: 'pushNotificationTemplates.js',
      moduleSystem: 'browserify'
    }]
  },

  templates: {
    index: path.join(WWW_DIR, 'index.html'),
    dest: DIST_DIR,
    // Paths is a little more complex here, as it's doing a recursive copy relative to a base dir
    paths: [
      [path.join(WWW_DIR, 'templates/**/*.html'), './www']
    ]
  },

  test: {
    mochaOptions: {
      reporter: 'spec'
    },
    paths: path.join(BASE_DIR, 'test/**/*.js')
  }

};
