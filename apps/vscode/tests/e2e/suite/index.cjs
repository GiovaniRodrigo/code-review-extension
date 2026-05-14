const path = require('node:path');
const Mocha = require('mocha');
const { glob } = require('glob');

async function run() {
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '.');
	const files = await glob('**/**.test.cjs', { cwd: testsRoot });

	files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

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
