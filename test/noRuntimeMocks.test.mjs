import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const localAi = readFileSync('src/ai/providers/LocalDeterministicAIProvider.ts', 'utf8');
const extension = readFileSync('src/extension.ts', 'utf8');
const safeCommand = readFileSync('src/infrastructure/vscode/safeCommandRegistration.ts', 'utf8');

test('community AI provider does not fabricate suggestions without a configured provider', () => {
  assert.match(localAi, /IA local não configurada/);
  assert.match(localAi, /return \[\];/);
  assert.doesNotMatch(localAi, /slice\(0, 3\)\.map/);
  assert.doesNotMatch(localAi, /Sugestão IA: valide/);
});

test('extension command registration is safe against duplicate installed versions', () => {
  assert.match(extension, /registerCommandOnce/);
  assert.match(safeCommand, /Ignoring duplicated VS Code command registration/);
  assert.match(safeCommand, /command '\$\{commandId\}' already exists/);
});
