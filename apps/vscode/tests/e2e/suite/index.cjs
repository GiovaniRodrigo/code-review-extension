const path = require('node:path');
const Mocha = require('mocha');
const { glob } = require('glob');

async function run() {
	const mocha = new Mocha({
		ui: 'bdd',
		color: true,
		timeout: 30000
	});

	const extensionRoot = path.resolve(__dirname, '../../..');

	console.log(`Extension root: ${extensionRoot}`);
	console.log(`Searching for tests in ${extensionRoot}/out/**/*.test.js`);

	const files = await glob('out/**/*.test.js', {
		cwd: extensionRoot,
		absolute: true
	});

	console.log(`Found ${files.length} test files`);

	for (const file of files) {
		console.log(`Adding test file: ${file}`);
		mocha.addFile(file);
	}

	if (files.length === 0) {
		throw new Error('No E2E compiled test files found in out/**/*.test.js');
	}

	return new Promise((resolve, reject) => {
		mocha.run(failures => {
			if (failures > 0) {
				reject(new Error(`${failures} tests failed.`));
			} else {
				resolve();
			}
		});
	});
}

module.exports = {
	run
};