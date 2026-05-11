import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const allowedCommands = ['giovaniCodeReview.openDashboard', 'giovaniCodeReview.syncRemote'];

test('extension exposes only dashboard and premium sync commands', () => {
  const commands = manifest.contributes.commands.map((item) => item.command).sort();
  assert.deepEqual(commands, [...allowedCommands].sort());
});

test('extension activation events are limited to dashboard, premium sync and sidebar view', () => {
  assert.deepEqual(manifest.activationEvents.sort(), [
    'onCommand:giovaniCodeReview.openDashboard',
    'onCommand:giovaniCodeReview.syncRemote',
    'onView:giovaniCodeReview.sidebar'
  ].sort());
});

test('extension keybindings are limited to dashboard and premium sync commands', () => {
  const keybindingCommands = manifest.contributes.keybindings.map((item) => item.command).sort();
  assert.deepEqual(keybindingCommands, [...allowedCommands].sort());
});

test('sidebar provider registration is protected against duplicate activation', () => {
  const extensionSource = readFileSync(new URL('../src/extension.ts', import.meta.url), 'utf8');
  const safeRegistrationSource = readFileSync(new URL('../src/infrastructure/vscode/safeWebviewRegistration.ts', import.meta.url), 'utf8');

  assert.equal((extensionSource.match(/registerWebviewViewProvider\(/g) ?? []).length, 0);
  assert.ok(extensionSource.includes('registerWebviewViewProviderOnce('));
  assert.ok(safeRegistrationSource.includes('Cannot register multiple views with same id'));
  assert.ok(safeRegistrationSource.includes('already registered'));
});
