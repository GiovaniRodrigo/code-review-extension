import * as path from 'node:path';

import {
    runTests
} from '@vscode/test-electron';

async function main() {

    try {

        const extensionDevelopmentPath =
            path.resolve(
                __dirname,
                '../../'
            );

        const extensionTestsPath =
            path.resolve(
                __dirname,
                './suite/index'
            );

        await runTests({

            extensionDevelopmentPath,

            extensionTestsPath
        });

    } catch (error) {

        console.error(
            'Failed to run E2E tests'
        );

        console.error(error);

        process.exit(1);
    }
}

main();