/**
 * Spin up the hapi server and serve the app.
 */

var gulp = require('gulp');

gulp.task('serve', ['build'], function() {
  var server = require('../../server');
  server.start();
});
