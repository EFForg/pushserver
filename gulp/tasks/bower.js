var gulp = require('gulp');
var bower = require('bower');

gulp.task('bower', function(done){
  bower.commands.install([], {save: true, forceLatest: true}, {})
    .on('end', function(installed) {
      done();
    });
});
