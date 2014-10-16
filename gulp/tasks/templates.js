/**
 * Copies application templates to the build directory.
 */

var gulp = require('gulp');
var gulpTap = require('gulp-tap');
var merge = require('merge-stream');
var path = require('path');
var preprocess = require('gulp-preprocess');
var reload = require('browser-sync').reload;

var handlebars = require('handlebars');

var config = require('../config').templates;

/**
 * Update the handlebars partial entry for this HTML file.
 *
 * NOTE: this relies on the server being invoked in the same set of tasks as this is run - e.g. this
 * gets called from a watch that takes a serve task as a dependency. This is so that the handlebars
 * partials object is shared and can be updated correctly.
 *
 * @param file
 */
var reRegisterHandlebarsPartial = function(file) {
  var templateName = file.path.replace(config.pathsBaseDir + path.sep, '').replace('.html', '');
  handlebars.registerPartial(templateName, file.contents.toString('utf-8'));
};

gulp.task('templates', function() {
  console.log('Copying templates to build dir');

  handlebars.partials = {};

  var index = gulp.src(config.index)
    .pipe(preprocess())
    .pipe(gulp.dest(config.dest));

  var templates = gulp.src(config.paths, {base: config.pathsBaseDir})
    .pipe(gulpTap(function(file, t) {
      reRegisterHandlebarsPartial(file);
    }))
    .pipe(gulp.dest(config.dest));

  return merge(index, templates);
});
