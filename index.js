"use strict";
var fw = require('./fw');
var p = require('path');
var browserify = require("browserify");
var browserifyInc = require('browserify-incremental-fork');
var xtend = require('xtend');
var babelify = require('babelify');
var NAME = "taskr-build";
var extname = require('path').extname;
var toArr = val => (Array.isArray(val) ? val : val == null ? [] : [val]);

function setError(ctx, msg) {
	const error = msg
		.replace(ctx.root, "")
		.replace(": ", ": \n\n  ")
		.replace(" while parsing", "\n\nwhile parsing")
		.concat("\n");

	ctx.emit("plugin_error", {
		plugin: NAME,
		error
	});

	return new Buffer(
		`console.error('${NAME}: Bundle error! Check CLI output.');`
	);
}

module.exports = function (task) {
	task.plugin(
		"build", {
			every: false
		},
		function* (files, opts) {

			var ists = fw.utils.ists(files[0].base);
			fw.utils.create_folder();
			// init bundler

			var b = browserify(xtend(browserifyInc.args, {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}));

			if (opts.env.match(/prod/i)) {
				b.plugin('tinyify');
			}

			browserifyInc(b, {
				cacheFile: `./cache/${opts.env.match(/prod/i) ? 'production' : 'development'}.json`
			});

			var conf = fw.babel(opts.fw, ists, opts.env);
			conf.transform.push([babelify, {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}]);
			// apply transforms
			for (const t of conf.transform || []) {
				b.transform.apply(b, toArr(t));
			}

			delete conf.transform;

			var bundle = obj =>
				new Promise((res, rej) => {
					b.add(p.format(obj), conf);
					b.bundle((err, buf) => (err ? rej(err) : res(buf)));
				});

			for (const file of files) {
				try {
					file.data = yield bundle(file);
				} catch (err) {
					file.data = setError(task, err.message);
				}
				const ext = new RegExp(extname(file.base).replace('.', '\\.') + '$', 'i');
				file.base = file.base.replace(ext, '.js');
				b.reset();
			}

			// replace `task._.files`
			this._.files = files;
		}
	);
};