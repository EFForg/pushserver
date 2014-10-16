/**
 * Fixer script to update the cl-strings dependency to fix an issue with it touch lodash globals.
 *
 * This is required as the current latest cl-strings sets the lodash.templateSettings.interpolate
 * property to a value that causes sequelize to fail on syncDatabase.
 *
 * See github.com/shakyShane/cl-strings/commit/2d7c4399a72c50e175573e8ab0fe3e79b2eac69c for the PR
 * needed to fix this and github.com/sequelize/sequelize/issues/2281 for the Sequelize issue in
 * question.
 *
 * This is a fairly hacky solution, but is used as no update to cl-strings has been pushed to
 * NPM since 0.0.5 8 months ago (as of 10/15/14).
 */

var escapeStringRegexp = require('escape-string-regexp');
var fs = require('fs');
var path = require('path');

var clStringsPath = path.join(
  __dirname, '../node_modules/browser-sync/node_modules/cl-strings/index.js');

fs.readFile(clStringsPath, 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  var replacements = [
    [new RegExp('_.templateSettings.interpolate.*;?', 'g'),
      'var templateSettings = { interpolate: /{:([\\s\\S]+?):}/g };'],

    [new RegExp(escapeStringRegexp('template = _.template(template)(params);'), 'g'),
      'template = _.template(template, params, templateSettings);']
  ];

  var result = data;
  for (var i = 0, replacement; i < replacements.length; ++i) {
    replacement = replacements[i];
    result = result.replace(replacement[0], replacement[1]);
  }

  fs.writeFile(clStringsPath, result, 'utf8', function(err) {
    if (err) {
      return console.log(err);
    }
  });

});
