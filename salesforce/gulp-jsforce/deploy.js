'use strict';

var gulp = require('gulp');
var gulpZip = require('gulp-zip');
var b64 = require('gulp-base64');

var deployToSF = require('./jsforce-deploy-stream');
var deploySf = require('gulp-jsforce-deploy');

/**
 * NOTES FOR USE
 *
 * You MUST creat a jsforce.config.js in the same
 * directory as this file for this to work.
 * Look at jsforce.example.config.js and copy/rename it
 * This currently depends on there being a single layer of folders
 */
var jsforceConfig = require('./jsforce.config');

/**
 * @func sf-deploy
 * this takes files in project directory and deploys all of them
 */
gulp.task('sf-deploy', [], function () {
//  gulp.src("./build/**/*")
//    .pipe(gulpZip("MyApp.resource"))
//    .pipe(gulp.dest("./pkg/staticresources"));
  console.log('sf-deploy is incomplete at this time');
  console.log('if you intend to build and deploy your spa, try "sf-deploy:spa"');
});

/**
 * @func sf-deploy
 * after your build has been cleaned and rebuilt
 * this deploys it to the server using your salesforce credentials
 * this does NOT add files to your project (at this time)
 */
gulp.task('sf-deploy:spa', [/*'clean', 'build'*/], function () {
  var buildLocations;
  //if 'all', allow all files in directory
  if (jsforceConfig.fileTypes === 'all') {
    buildLocations = jsforceConfig.paths.buildDir + '/**/*';

  //otherwise, create array of whitelisted types
  } else {
    buildLocations = jsforceConfig.fileTypes.map(function (type) {
      return jsforceConfig.paths.buildDir + '/**/*.' + type;
    });
  }

  gulp.src(buildLocations, {base: "."})//TODO: add base directory
    //.pipe(b64())
    .pipe(gulpZip("bundle.resource"))
    .pipe(deployToSF())
    /*
    .pipe(deploySf({
      username: jsforceConfig.credentials.username,
      password: jsforceConfig.credentials.password,
      accessToken: jsforceConfig.credentials.token,
      loginUrl: 'https://login.salesforce.com'
    }));
    */
});//END gulp task sf-deploy

module.exports = function () {
  console.error('If you see this message, then something imported incorrectly from gulp-jsforce/deploy.js');
};
