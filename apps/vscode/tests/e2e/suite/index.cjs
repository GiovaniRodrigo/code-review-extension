const path = require('node:path');
const Mocha = require('mocha');
const { globSync } = require('glob');

function run() {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true
    });

    const testsRoot = __dirname;

    const files = globSync('**/*.test.cjs', {
        cwd: testsRoot
    });

    for (const file of files) {
        mocha.addFile(path.resolve(testsRoot, file));
    }

    return new Promise((resolve, reject) => {
        mocha.run(failures => {
            if (failures > 0) {
                reject(new Error(`${failures} tests failed`));
                return;
            }

            resolve();
        });
    });
}

module.exports = {
    run
};