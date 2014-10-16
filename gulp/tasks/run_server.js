/**
 * Spin up the hapi server and serve the app.
 */

var gulp = require('gulp');

gulp.task('runServer', function() {
  var server = require('../../server');
  server.start();
});
