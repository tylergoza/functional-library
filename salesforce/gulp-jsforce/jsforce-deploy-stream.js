'use strict';

var through2 = require("through2");
var jsforce = require('jsforce');

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
 * @func deployToSF
 * handles connection to salesforce then deployment of given files
 */
var deployToSF = function () {
  //shorthand credentials
  var username = jsforceConfig.credentials.username;
  var pwdAndToken = jsforceConfig.credentials.password + jsforceConfig.credentials.token;

  console.log('deployToSF initiated...');

  //handle stream
  return through2.obj(function (file, enc, callback) {
    console.log('deployToSF is firing connection');
    //connnect to SalesForce using jsforce
    var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});

    console.log('deployToSF is logging in');

    return conn.login(username, pwdAndToken)

      .then(function () {
        var metadata = [{
          fullName: 'bundle.resource',
          description: 'spa data files',
          content: file.contents,
          contentType: 'application/zip',
          cacheControl: 'Private'
        }];

        conn.metadata.upsert('StaticResource', metadata)
          .then(function(results) {
            console.log('results are: ', results);
            console.log('success ? : ' + results.success);
            console.log('created ? : ' + results.created);
            console.log('fullName : ' + results.fullName);
          }, function (err) {
            console.error('error is: ', err);
          });
      })
      /*
      .then(function (res) {
        conn.metadata.deploy(file.contents)
          .complete(function (err, result) {
            console.log('deployToSF is firing complete err: ', err, 'result: ', result);
          });
      })
      */
      //handle if server gives back a component failure
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
  });
};

module.exports = deployToSF;


/*
var fs = require('fs');
conn.metadata.retrieve({ packageNames: [ 'My Test Package' ] })
             .stream().pipe(fs.createWriteStream("./path/to/MyPackage.zip"));

var fs = require('fs');
var zipStream = fs.createReadStream("./path/to/MyPackage.zip");
conn.metadata.deploy(zipStream, { runTests: [ 'MyApexTriggerTest' ] })
  .complete(function(err, result) {
    if (err) { console.error(err); }
    console.log('done ? :' + result.done);
    console.log('success ? : ' + result.true);
    console.log('state : ' + result.state);
    console.log('component errors: ' + result.numberComponentErrors);
    console.log('components deployed: ' + result.numberComponentsDeployed);
    console.log('tests completed: ' + result.numberTestsCompleted);
  });
*/
