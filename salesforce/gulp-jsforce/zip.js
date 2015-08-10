'use strict';
var gutil = require('gulp-util');
var through = require('through2');
//var chalk = require('chalk');
var fs = require("fs-extra");
var jszip = require("jszip");
var zip = new jszip();

/**
 * @param  {[options.name]}
 * @param  {[options.outpath]}
 * @return {[null]}
 */
module.exports = function(options) {
	options = options || {};
	var root = null;
	var name = options.name || "dist.zip";
	var outpath = options.outpath || "dist";

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

	return through.obj(function(file, enc, cb) {
		var self = this;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError(gutil.colors.red("[Error]"), gutil.colors.cyan("Streaming not supported")));
			return;
		}

		if (root === null || root === undefined) {
			root = file.path.replace(file.relative, "");
		}

    //generate files
		var files = getFileList(root);

    //iterate and add files to zip
		if (files !== null && files !== undefined && files.length !== 0) {
			for (var i = 0; i < files.length; i++) {
				var content = fs.readFileSync(root + "/" + files[i]);
				zip.file(files[i], content);
			}
		}

    //generate zip file
    //zipApp.generate({base64: true, compression: 'DEFLATE'});
		var buffer = zip.generate({
      base64: true,
			//type: "nodebuffer",
      compression: 'DEFLATE'
		});

		fs.writeFile(name, buffer, function() {
			fs.move(name, outpath + "/" + name,
            { clobber: true },
            function(error) {
              console.log(error);
      				self.push(null);
      				cb();
      			});//END move
		});//END writeFile
	});//END through
};
