import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('webview exposes complete global user feedback states', async () => {
  const component = await readFile('webview-ui/src/components/molecules/UserFeedback.jsx', 'utf8');
  const app = await readFile('webview-ui/src/App.jsx', 'utf8');

  assert.match(component, /loading/);
  assert.match(component, /success/);
  assert.match(component, /error/);
  assert.match(component, /warning/);
  assert.match(component, /info/);
  assert.match(component, /aria-live/);
  assert.match(component, /aria-busy/);
  assert.match(app, /UserFeedback/);
  assert.match(app, /postWithFeedback/);
});

test('extension backend sends standardized operation feedback events', async () => {
  const source = await readFile('src/presentation/reviewPanel.ts', 'utf8');

  assert.match(source, /postOperationStarted/);
  assert.match(source, /operationStarted/);
  assert.match(source, /operationCompleted/);
  assert.match(source, /operationFailed/);
  assert.match(source, /syncRemote: 'Sincronizando dados remotos/);
  assert.match(source, /runVSCodeTests: 'Solicitando testes ao VS Code/);
});

test('official documentation defines the complete feedback UX policy', async () => {
  const docs = await Promise.all([
    readFile('docs/USER_FEEDBACK_UX.md', 'utf8'),
    readFile('README.md', 'utf8'),
    readFile('docs/ARCHITECTURE.md', 'utf8')
  ]);
  const combined = docs.join('\n');

  assert.match(combined, /carregando/);
  assert.match(combined, /sucesso/);
  assert.match(combined, /erro/);
  assert.match(combined, /progresso/);
  assert.match(combined, /operationStarted/);
  assert.match(combined, /operationCompleted/);
  assert.match(combined, /operationFailed/);
});
