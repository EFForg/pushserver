/**
 * Copies application templates to the build directory.
 */

var gulp = require('gulp');
var preprocess = require('gulp-preprocess');

var config = require('../config').templates;

gulp.task('templates', function() {
  console.log('Copying templates to build dir');

  gulp.src(config.index)
    .pipe(preprocess())
    .pipe(gulp.dest(config.dest));

  for (var i = 0, path, dir; i < config.paths.length; ++i) {
    path = config.paths[i][0];
    dir = config.paths[i][1];
    gulp.src(path, {base: dir})
      .pipe(gulp.dest(config.dest));
  }

});
