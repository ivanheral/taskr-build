'use strict';

const join = require('path').join;
const Taskr = require('taskr');
const test = require('tape');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, 'tmp');

test('taskr-build', t => {
	t.plan(1);

	const taskr = new Taskr({
		plugins: [
			require('../')
		],
		tasks: {
			a: function* (f) {
				const all = `${dir}/main.tsx`;
				t.true('build' in taskr.plugins, 'attach `build()` plugin to taskr');
				yield f.source(all).build({fw: "react", env: "development", cache: "yes"}).target(tmp);
			}
		}
	});

	taskr.start('a');
});