/**
 * Creates .js files containing template cache entries for templates used by our ng modules.
 */

var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');

var config = require('../config').ngTemplates;
var handleErrors = require('../util/handle_errors');

gulp.task('ngTemplates', function() {

  var makeTemplateFile = function(templateConfig) {

    return gulp.src(templateConfig.paths)
      .on('error', handleErrors)
      .pipe(minifyHTML({
        quotes: true
      }))
      .pipe(templateCache(templateConfig.templateFileName, {
        module: templateConfig.ngModuleName,
        moduleSystem: templateConfig.moduleSystem,
        root: templateConfig.fileRoot
      }))
      .pipe(gulp.dest(templateConfig.dest));
  };


  config.moduleTemplates.forEach(makeTemplateFile);
});
