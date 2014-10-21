/**
 * Syncs the underlying sequelize database with the latest model definitions.
 */

var gulp = require('gulp');

var config = require('../config').syncDatabase;
var dbUtils = require('../../db/db_utils');
var models = require('../../db/models');

gulp.task('syncDb', function(done) {

  dbUtils.syncDatabase(function() {
    done();
  }, function(err) {
    console.log('unable to sync database ' + err);
    done();
  }, config.force);

});
