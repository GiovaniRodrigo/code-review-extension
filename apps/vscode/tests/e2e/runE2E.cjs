const path = require('node:path');
const { runTests } = require('@vscode/test-electron');

const resolveDownloadedVSCodeCli = () => {
    const downloadedRoot = path.resolve(__dirname, '../../../../.vscode-test/vscode-linux-x64-1.120.0');
    const cliPath = path.join(downloadedRoot, 'bin/code');

    return cliPath;
};

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');

        await runTests({ 
            vscodeExecutablePath: resolveDownloadedVSCodeCli(),
            extensionDevelopmentPath, 
            extensionTestsPath
        });
    } catch (err) {
        console.error('Failed to run tests', err);
        process.exit(1);
    }
}

main();
