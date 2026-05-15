const { spawn } = require('node:child_process');
const path = require('node:path');

const blockedPatterns = [
  /already registered/i,
  /Cannot register/i,
  /view provider .* already registered/i,
  /command .* already exists/i,
  /property .* already registered/i,
  /Extension host terminated/i,
  /UnhandledPromiseRejection/i,
  /not known or not activated/i,
  /Could not restore review session/i
];

const runE2EScript = path.resolve(__dirname, '../e2e/runE2E.cjs');

console.log(`[DIAGNOSTICS] Starting Extension Host Diagnostics via ${runE2EScript}`);

const child = spawn('node', [runE2EScript], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';

child.stdout.on('data', data => {
  const str = data.toString();
  output += str;
  process.stdout.write(data);
});

child.stderr.on('data', data => {
  const str = data.toString();
  output += str;
  process.stderr.write(data);
});

child.on('close', code => {
  const detectedFailures = blockedPatterns.filter(pattern =>
    pattern.test(output)
  );

  if (detectedFailures.length > 0) {
    console.error('\n[DIAGNOSTICS] FAILED: Blocked runtime patterns detected in Extension Host:');
    detectedFailures.forEach(pattern => {
      console.error(`  - Pattern: ${pattern.toString()}`);
    });
    process.exit(1);
  }

  if (code !== 0) {
    console.error(`\n[DIAGNOSTICS] E2E process exited with code ${code}`);
    process.exit(code ?? 1);
  }

  console.log('\n[DIAGNOSTICS] PASSED: No critical runtime errors detected.');
  process.exit(0);
});
