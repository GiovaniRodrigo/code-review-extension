import * as fs from 'fs';
import * as path from 'path';

async function validateBuild() {
  const distPath = path.resolve(__dirname, '../dist/extension.js');
  console.log(`Checking for build artifact at: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    console.error('FAIL: Build artifact dist/extension.js not found!');
    process.exit(1);
  }

  const stats = fs.statSync(distPath);
  if (stats.size < 1000) { // Arbitrary minimum size for a bundled extension
    console.error(`FAIL: Build artifact is too small (${stats.size} bytes). Something might be wrong.`);
    process.exit(1);
  }

  console.log(`SUCCESS: Build artifact found and looks valid (${stats.size} bytes).`);
}

validateBuild().catch(err => {
  console.error(err);
  process.exit(1);
});
