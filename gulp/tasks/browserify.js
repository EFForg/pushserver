/**
 * Bundle application js and component js to a single file.
 */

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify  = require('watchify');

var config = require('../config').browserify;
var bundleLogger = require('../util/bundle_logger');
var handleErrors = require('../util/handle_errors');

gulp.task('browserify', ['appSettings', 'ngTemplates'], function(callback) {

  var bundlesToProcess = config.bundleConfigs.length;

  var browserifyBundle = function(bundleConfig) {

    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: true,
      entries: bundleConfig.entries,
      debug: config.debug
    });

    var bundle = function() {
      bundleLogger.start(bundleConfig.outputName);

      return bundler
        .bundle()
        .on('error', handleErrors)
        .pipe(source(bundleConfig.outputName))
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

    // If in watch mode, turn on watchify to re-bundle on changes
    if (global.isWatching) {
      bundler = watchify(bundler);
      bundler.on('update', bundle);
    }

    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName)

      bundlesToProcess--;
      if (bundlesToProcess === 0) {
        callback();
      }
    };

    return bundle();
  };

  config.bundleConfigs.forEach(browserifyBundle);
});
