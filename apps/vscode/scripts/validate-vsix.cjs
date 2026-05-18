#!/usr/bin/env node
const { execFileSync } = require('node:child_process');
const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const cwd = process.cwd();
const vsixFiles = readdirSync(cwd).filter(name => name.endsWith('.vsix')).map(name => join(cwd, name));
if (!vsixFiles.length) throw new Error('No VSIX file found in apps/vscode. Run npm run package first.');
const vsix = vsixFiles.sort().at(-1);
const list = execFileSync('unzip', ['-Z1', vsix], { encoding: 'utf8' }).split('\n').filter(Boolean);
const required = ['extension/package.json','extension/dist/extension.js','extension/readme.md','extension/changelog.md','extension/LICENSE.txt','extension/media/activitybar.svg','extension/media/icon-128.png','extension/media/screenshots/dashboard.png','extension/media/screenshots/diagnostics.png','extension/media/reviewView.html','extension/media/reviewView.css','extension/media/reviewView.js'];
const forbiddenPatterns = [/^extension\/src\//,/^extension\/tests\//,/^extension\/scripts\//,/^extension\/docs\//,/^extension\/node_modules\//,/^extension\/out\//,/\.map$/,/stats\.html$/,/meta\.json$/,/vitest\.config/,/tsconfig/,/jest\.config/];
const missing = required.filter(path => !list.includes(path));
const forbidden = list.filter(path => forbiddenPatterns.some(pattern => pattern.test(path)));
if (missing.length || forbidden.length) { console.error('VSIX validation failed.'); if (missing.length) console.error('Missing files:\n' + missing.map(x=>`- ${x}`).join('\n')); if (forbidden.length) console.error('Forbidden files:\n' + forbidden.map(x=>`- ${x}`).join('\n')); process.exit(1); }
const pkg = JSON.parse(execFileSync('unzip', ['-p', vsix, 'extension/package.json'], { encoding: 'utf8' }));
if (pkg.main !== './dist/extension.js') throw new Error(`Invalid extension main entry: ${pkg.main}`);
if (pkg.displayName.includes('(Beta)')) throw new Error('Production package must not use Beta display name.');
if (pkg.displayName !== 'Git Code Review') throw new Error(`Product package must use Git Code Review display name, found: ${pkg.displayName}`);
if (!pkg.icon || pkg.icon !== 'media/icon-128.png') throw new Error('Product package must include marketplace icon.');
const commands = new Set((pkg.contributes?.commands || []).map(c => c.command));
for (const command of ['code-review.startReview','code-review.runDiagnostics','code-review.analyzeWorkspace','code-review.configureCloudProvider','code-review.exportPdf','code-review.selectReviewTemplate']) { if (!commands.has(command)) throw new Error(`Missing product command: ${command}`); }
console.log(`VSIX validation OK: ${vsix}`); console.log(`Files included: ${list.length}`);
