/**
 * Gulp file for building and running all Push Server tasks.
 */

var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpExit = require('gulp-exit');
var gulpInsert = require('gulp-insert');
var gulpMocha = require('gulp-mocha');
var gutil = require('gulp-util');
var header = require('gulp-header');
var livereload = require('gulp-livereload');
var minifyHTML = require('gulp-minify-html');
var ngTemplates = require('gulp-angular-templatecache');
var path = require('path');
var preprocess = require('gulp-preprocess');

var WWW_DIR = path.join(__dirname, 'www');
var BUILD_DIR = path.join(WWW_DIR, 'build');


var buildConstants = function() {
  var config = require('config');
  // Build an abbreviated version of the constants to pass through to the frontend
  var constants = {
    SUPPORTED_CHANNELS: config.get('SUPPORTED_CHANNELS'),
    APPLICATION: config.get('APPLICATION')
  };
  return 'var pushServerSettings = ' + JSON.stringify(constants) + ';\n\n';
};

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';
  return gulp.src('./test/**/*.js')
    .pipe(gulpMocha({reporter: 'spec'}))
    // NOTE: gulpExit is used here as otherwise the task hangs, see:
    //   github.com/sindresorhus/gulp-mocha/pull/31
    .pipe(gulpExit());
});

gulp.task('css', function() {
  gulp.src([path.join(WWW_DIR, '/css/*.css')])
    .on('error', gutil.log)
    .pipe(concat('push_server.min.css'))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('templates', function() {
  console.log('Copying index.html to release dir');
  gulp.src(path.join(WWW_DIR, 'index.html'))
    .pipe(preprocess())
    .pipe(gulp.dest(BUILD_DIR));

  console.log('Compiling ng templates to a templates file');
  // This is a bit hacky - it sets up required boilerplate to use the templates as a separate module
  var templatesPrepend = 'var pushServerTemplates = angular.module("pushNotification.templates", []);\n';
  gulp.src(path.join(WWW_DIR, 'templates/**/*.html'))
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(ngTemplates('templates.js', {'module': 'pushNotification.templates'}))
    .pipe(gulpInsert.prepend(templatesPrepend))
    .pipe(gulp.dest(path.join(WWW_DIR, 'templates')));
});

// TODO(leah): pick up debug mode
gulp.task('js', ['templates'], function () {
  // This timeout ensures that the templates task has completed and created a file handle that
  // browserify can pick up. If it's not used js compilation will fail to pick up the template file.
  // This causes a crash on first run and delayed template changes subsequently.
  //
  // NOTE: you may need to tune the below timeout to something > 200ms depending on your system.
  setTimeout(function() {
    gulp.src([path.join(WWW_DIR, 'js/app.js')])
      .on('error', gutil.log)
      .pipe(browserify({
        insertGlobals: true,
        debug: !gutil.env.production
      }))
      // Stuff application settings into a top level var in the file
      .pipe(header(buildConstants()))
      // Bundle to a single file and output to the release dir
      .pipe(concat('push_server.min.js'))
      .pipe(gulp.dest(BUILD_DIR));
  }, 200);
});

gulp.task('watch', function() {
  gulp.watch('www/js/**/*.js', ['js']);
  gulp.watch(['www/templates/**/*.html'], ['js']);
  gulp.watch('www/index.html', ['templates']);
  gulp.watch('www/css/**/*.css', ['css']);

  livereload.listen();
  gulp.watch(path.join(BUILD_DIR, '**')).on('change', livereload.changed);
});

gulp.task('serve', ['css', 'js', 'watch'], function() {
  var server = require('./server');
  server.start();
});

gulp.task('default', ['css', 'js']);
