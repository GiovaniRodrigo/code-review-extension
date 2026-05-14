const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');

        const workspacePath = path.join(os.tmpdir(), 'vscode-test-workspace-' + Date.now());
        if (!fs.existsSync(workspacePath)) {
            fs.mkdirSync(workspacePath, { recursive: true });
        }

        await runTests({ 
            extensionDevelopmentPath, 
            extensionTestsPath,
            launchArgs: [workspacePath] 
        });
    } catch (err) {
        console.error('Failed to run tests', err);
        process.exit(1);
    }
}

main();
