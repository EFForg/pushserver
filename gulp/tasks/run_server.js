/**
 * Spin up the hapi server and serve the app.
 */

var gulp = require('gulp');

gulp.task('runServer', ['build'], function() {
  var server = require('../../server');
  server.start();
});
