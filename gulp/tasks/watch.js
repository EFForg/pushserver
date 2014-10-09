/**
 * Sets up watches on templates and CSS files.
 *
 * NOTE: watchify is used for .js files, so they're not watched here.
 */

var gulp  = require('gulp');
var config = require('../config');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch(config.css.paths, ['css']);

  var ngTemplatePaths = [];
  var pathsArr = config.ngTemplates.moduleTemplates.map(function(moduleTemplate) {
    return moduleTemplate.paths;
  });
  gulp.watch(ngTemplatePaths.concat.apply(ngTemplatePaths, pathsArr), ['ngTemplates']);


  var templatesPaths = [config.templates.index];
  var templatesPathsArr = config.templates.paths.map(function(paths) {
    return paths[0];
  });

  gulp.watch(templatesPaths.concat.apply(templatesPaths, templatesPathsArr), ['templates']);
});
