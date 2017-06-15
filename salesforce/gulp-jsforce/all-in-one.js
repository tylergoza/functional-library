'use strict';

var gulp = require('gulp');
//var gutil = require('gulp-util');
var fs = require("fs-extra");
var jsforce = require('jsforce');
var jszip = require("jszip");
var zip = new jszip();

var jsforceConfig = require('./jsforce.config');
var defaultCredentials = jsforceConfig.credentials[0];

//directories
var root = './dist';
//var outputDir = './dist';
//var fileName = 'dist.zip';

//credentials
var username = defaultCredentials.username;
var pwdAndToken = defaultCredentials.password + defaultCredentials.token;

gulp.task('sf-update:spa', ['build'], function () {
  console.log('beginning salesforce update');

  //function to get all files in directory
  var getFileList = function(_path) {
  	var fileslist = [];
  	var files = fs.readdirSync(_path);

  	files.forEach(function(file) {
  		var pathname = _path + "/" + file;
  		var stat = fs.lstatSync(pathname);

  		if (!stat.isDirectory()) {
  			fileslist.push(pathname.replace(root + "/", ""));
  		} else {
  			fileslist = fileslist.concat(getFileList(pathname));
  		}
  	});
  	return fileslist;
  };

  //generate files
	var files = getFileList(root);

  //add files to zip object
	if (files !== null && files !== undefined && files.length !== 0) {
		for (var i = 0; i < files.length; i++) {
			var content = fs.readFileSync(root + "/" + files[i]);
			zip.file(files[i], content);
		}
	}

  //generate zip file
	var zipFile = zip.generate({ base64: true, compression: 'DEFLATE' });

  console.log('deployToSF is firing connection');
  //connnect to SalesForce using jsforce
  var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});

  console.log('deployToSF is logging in');

  conn.login(username, pwdAndToken)
    .then(function () {
      var metadata = [{
        fullName: jsforceConfig.bundleName,
        description: 'spa data files',
        content: zipFile,//fs.readFileSync(outputDir + "/" + fileName),
        contentType: 'application/zip',
        cacheControl: 'Private'
      }];

      conn.metadata.update('StaticResource', metadata)
        .then(function(results) {
          console.log('results are: ', results);
          console.log('success ? : ' + results.success);
          console.log('created ? : ' + results.created);
          console.log('fullName : ' + results.fullName);
        }, function (err) {
          console.error('error is: ', err);
        });
    })
    .then(function (res) {
      console.log('deployToSF is firing response check.', res);
      if (res.details && res.details.componentFailures) {
        console.error(res.details.componentFailures);
      }
    }, function (err) {
      console.error(err);
    });
});

gulp.task('sf-create:spa', [/*'clean', 'build'*/], function () {
  console.log('beginning sometest');

  //function to get all files in directory
  var getFileList = function(_path) {
  	var fileslist = [];
  	var files = fs.readdirSync(_path);

  	files.forEach(function(file) {
  		var pathname = _path + "/" + file;
  		var stat = fs.lstatSync(pathname);

  		if (!stat.isDirectory()) {
  			fileslist.push(pathname.replace(root + "/", ""));
  		} else {
  			fileslist = fileslist.concat(getFileList(pathname));
  		}
  	});
  	return fileslist;
  };

  //generate files
	var files = getFileList(root);

  //add files to zip object
	if (files !== null && files !== undefined && files.length !== 0) {
		for (var i = 0; i < files.length; i++) {
			var content = fs.readFileSync(root + "/" + files[i]);
			zip.file(files[i], content);
		}
	}

  //generate zip file
	var zipFile = zip.generate({ base64: true, compression: 'DEFLATE' });

  console.log('deployToSF is firing connection');
  //connnect to SalesForce using jsforce
  var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});

  console.log('deployToSF is logging in');

  conn.login(username, pwdAndToken)
    .then(function () {
      var metadata = [{
        fullName: jsforceConfig.bundleName,
        description: 'spa data files',
        content: zipFile,//fs.readFileSync(outputDir + "/" + fileName),
        contentType: 'application/zip',
        cacheControl: 'Private'
      }];

      conn.metadata.create('StaticResource', metadata)
        .then(function(results) {
          console.log('results are: ', results);
          console.log('success ? : ' + results.success);
          console.log('created ? : ' + results.created);
          console.log('fullName : ' + results.fullName);
        }, function (err) {
          console.error('error is: ', err);
        });
    })
    .then(function (res) {
      console.log('deployToSF is firing response check.', res);
      if (res.details && res.details.componentFailures) {
        console.error(res.details.componentFailures);
      }
    }, function (err) {
      console.error(err);
    });
});

gulp.task('sf-get:spa', function () {
  console.log('beginning sometest');


  //connnect to SalesForce using jsforce
  var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});


  console.log('deployToSF is logging in');
  conn.login(username, pwdAndToken)
    .then(function () {
      return conn.metadata.read('StaticResource', 'resource');
    })
    .then(function (res) {
      fs.writeFile(root + '/resource.zip', res.content, {encoding: null}, function (err) {
        if (err){ console.log("error is: ", err); }
        console.log('deployed to: ' + root + '/resource.zip');
      });

      if (res.details && res.details.componentFailures) {
        console.error(res.details.componentFailures);
      }
    }, function (err) {
      console.error(err);
    });
});

gulp.task('sf-update-all:spa', ['build'], function () {
  console.log('beginning salesforce update for ALL known orgs');

  //function to get all files in directory
  var getFileList = function(_path) {
  	var fileslist = [];
  	var files = fs.readdirSync(_path);

  	files.forEach(function(file) {
  		var pathname = _path + "/" + file;
  		var stat = fs.lstatSync(pathname);

  		if (!stat.isDirectory()) {
  			fileslist.push(pathname.replace(root + "/", ""));
  		} else {
  			fileslist = fileslist.concat(getFileList(pathname));
  		}
  	});
  	return fileslist;
  };

  //generate files
	var files = getFileList(root);

  //add files to zip object
	if (files !== null && files !== undefined && files.length !== 0) {
		for (var i = 0; i < files.length; i++) {
			var content = fs.readFileSync(root + "/" + files[i]);
			zip.file(files[i], content);
		}
	}

  //generate zip file
	var zipFile = zip.generate({ base64: true, compression: 'DEFLATE' });

  jsforceConfig.credentials.forEach(function (cred) {
    console.log('sf-update-all:spa is firing connection for: ' + cred.username);

    //credentials
    var username = cred.username;
    var pwdAndToken = cred.password + cred.token;

    //connnect to SalesForce using jsforce
    var conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});

    console.log('sf-update-all:spa is logging in to user ' + cred.username);
    conn.login(username, pwdAndToken)
      .then(function () {
        var metadata = [{
          fullName: jsforceConfig.bundleName,
          description: 'spa data files',
          content: zipFile,
          contentType: 'application/zip',
          cacheControl: 'Private'
        }];

        conn.metadata.update('StaticResource', metadata)
          .then(function(results) {
            console.log('results for ' + cred.username + ' are: ', results);
            console.log('success ? : ' + results.success);
            console.log('created ? : ' + results.created);
            console.log('fullName : ' + results.fullName);
          }, function (err) {
            console.error('error for ' + cred.username + ' is: ', err);
          });
      })
      .then(function (res) {
        console.log('sf-update-all:spa is firing response check.', res);
        if (res.details && res.details.componentFailures) {
          console.error(res.details.componentFailures);
        }
      }, function (err) {
        console.error(err);
      });

  });
});
