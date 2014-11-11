/**
 * Bundles all .js libs into a single .js file.
 *
 * This relies on browserify-shim (in package.json) to support shimming the libs via the global:xxx
 * shim.
 */

var concat = require('gulp-concat');
var gulp = require('gulp');

var config = require('../config').jsLibs;

gulp.task('jsLibs', function() {
  gulp.src(config.jsLibs)
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(config.distDir));
});
