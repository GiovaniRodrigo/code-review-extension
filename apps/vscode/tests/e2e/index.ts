import * as path from 'path';
import Mocha from 'mocha';
import { globSync } from 'glob';

export function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'bdd',
        color: true
    });

    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((c, e) => {
        try {
            const files = globSync('e2e/**/*.e2e.test.js', { cwd: testsRoot });

            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            mocha.run(failures => {
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                } else {
                    c();
                }
            });
        } catch (err) {
            console.error(err);
            e(err);
        }
    });
}
