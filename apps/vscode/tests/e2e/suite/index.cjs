const path = require('node:path');
const Mocha = require('mocha');
const { glob } = require('glob');

async function run() {
	const mocha = new Mocha({
		ui: 'bdd',
		color: true,
		timeout: 10000
	});

	const testsRoot = path.resolve(__dirname, '../../..');
	console.log(`Searching for tests in ${testsRoot}/out/**/*.test.js`);
	const files = await glob('out/**/*.test.js', { cwd: testsRoot });

	console.log(`Found ${files.length} test files`);
	files.forEach(f => {
		console.log(`Adding test file: ${f}`);
		mocha.addFile(path.resolve(testsRoot, f));
	});

	return new Promise((resolve, reject) => {
		try {
			mocha.run(failures => {
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`));
				} else {
					resolve();
				}
			});
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
}

module.exports = {
	run
};
