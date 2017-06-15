'use strict';

var gulp = require('gulp');
//var gulpZip = require('gulp-zip');
//var deployToSF = require('./jsforce-deploy-stream');

/**
 * NOTES FOR USE
 *
 * You MUST creat a jsforce.config.js in the same
 * directory as this file for this to work.
 * Look at jsforce.example.config.js and copy/rename it
 * This currently depends on there being a single layer of folders
 */
var jsforceConfig = require('./jsforce.config');
var jsforce = require('jsforce');


/**
 * @func sf-build
 * after your build has been rebuilt
 * this builds it to the given directory
 */
gulp.task('sf-build', [/*'clean', 'build'*/], function () {

  //shorthand credentials
  var username = jsforceConfig.credentials.username;
  var pwdAndToken = jsforceConfig.credentials.password + jsforceConfig.credentials.token;

  //connnect to SalesForce using jsforce
  var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});
  return conn.login(username, pwdAndToken)
    .then(function () {
      var metadata = [{
        fullName: 'bundle.resource',
        description: 'spa data files',
        //content: file.contents,
        contentType: 'application/zip',
        cacheControl: 'Private'
      }];

      conn.metadata.upsert('StaticResource', metadata)
        .then(function(results) {
          console.log('results are: ', results);
          for (var i=0; i < results.length; i++) {
            var result = results[i];
            console.log('success ? : ' + result.success);
            console.log('created ? : ' + result.created);
            console.log('fullName : ' + result.fullName);
          }
        }, function (err) {
          console.error('error is: ', err);
        });
    })
    .then(function (res) {
      console.log('deployToSF is firing response check.', res);
      if (res.details && res.details.componentFailures) {
        console.error(res.details.componentFailures);
        return callback(new Error('Deploy failed.'));
      }
      callback();
    //handle response if it throws error
    }, function (err) {
      console.error(err);
      callback(err);
    });
  console.log('sf-build is incomplete at this time');
  console.log('if you intend to build and deploy your spa, try "sf-deploy:spa"');
});

/**
 * @func sf-build:spa
 * after your build has been rebuilt
 * this builds it to the given directory
 */
gulp.task('sf-build:spa', [/*'clean', 'build'*/], function () {
  console.log('sf-build:spa is incomplete at this time');
  console.log('if you intend to build and deploy your spa, try "sf-deploy:spa"');
});

module.exports = function () {
  console.error('If you see this message, then something imported incorrectly from gulp-jsforce/build.js');
};
