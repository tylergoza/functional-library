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
//var jsforceConfig = require('./jsforce.config');

/**
 * @func sf-watch
 * this will re-deploy your sources when they change
 */
gulp.task('sf-watch', [], function () {
//  gulp.src("./build/**/*")
//    .pipe(gulpZip("MyApp.resource"))
//    .pipe(gulp.dest("./pkg/staticresources"));
  console.log('sf-watch is incomplete at this time');
  console.log('if you intend to build and deploy your spa, try "sf-deploy:spa"');
});

/**
 * @func sf-watch:spa
 * this will re-deploy your sources when they change
 */
gulp.task('sf-watch:spa', [], function () {
//  gulp.src("./build/**/*")
//    .pipe(gulpZip("MyApp.resource"))
//    .pipe(gulp.dest("./pkg/staticresources"));
  console.log('sf-watch:spa is incomplete at this time');
  console.log('if you intend to build and deploy your spa, try "sf-deploy:spa"');
});

module.exports = function () {
  console.error('If you see this message, then something imported incorrectly from gulp-jsforce/watch.js');
};
