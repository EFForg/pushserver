/**
 * Sets up watches on templates and CSS files.
 *
 * NOTE: watchify is used for .js files, so they're not watched here.
 */

var gulp  = require('gulp');
var config = require('../config');

gulp.task('watch', ['runServer', 'setWatch', 'browserSync'], function() {
  gulp.watch(config.css.paths, ['css']);
  gulp.watch(config.ngTemplates.paths, ['ngTemplates']);

  var templatesPaths = [config.templates.index];
  gulp.watch(templatesPaths.concat.apply(templatesPaths, config.templates.paths), ['templates']);
});
