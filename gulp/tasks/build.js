var gulp = require('gulp');

gulp.task('build', ['jsLibs', 'browserify', 'css', 'templates']);
