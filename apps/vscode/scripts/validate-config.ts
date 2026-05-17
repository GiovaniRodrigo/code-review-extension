import * as fs from 'fs';
import * as path from 'path';

async function validateConfig() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const requiredFields = ['name', 'version', 'main', 'engines', 'contributes'];
  for (const field of requiredFields) {
    if (!packageJson[field]) {
      console.error(`FAIL: Missing required field "${field}" in package.json`);
      process.exit(1);
    }
  }

  // Check if engines.vscode is present
  if (!packageJson.engines.vscode) {
    console.error('FAIL: package.json missing engines.vscode');
    process.exit(1);
  }

  console.log('SUCCESS: package.json configuration is valid.');
}

validateConfig().catch(err => {
  console.error(err);
  process.exit(1);
});
