const path = require('node:path');

const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        const extensionTestsPath = path.resolve(
            __dirname,
            './suite/index.cjs'
        );

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath
        });
    } catch (error) {
        console.error('Failed to run E2E tests');
        console.error(error);
        process.exit(1);
    }
}

main();