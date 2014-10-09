/**
 * Create CSS file for use by the app.
 */

var concat = require('gulp-concat');
var gulp = require('gulp');

var config = require('../config').css;
var handleErrors = require('../util/handle_errors');

gulp.task('css', function() {
  // NOTE: the bootstrap file used is from http://bootswatch.com/superhero - this is a custom theme
  //       and associated CSS and cannot be included via bower.
  gulp.src(config.paths)
    .on('error', handleErrors)
    .pipe(concat('push_server.min.css'))
    .pipe(gulp.dest(config.dest));
});
