import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const app = readFileSync('webview-ui/src/App.jsx', 'utf8');
const leftbar = readFileSync('webview-ui/src/components/organisms/ReviewLeftbar.jsx', 'utf8');
const dashboard = readFileSync('webview-ui/src/components/organisms/DashboardCenter.jsx', 'utf8');
const rightbar = readFileSync('webview-ui/src/components/organisms/Rightbar.jsx', 'utf8');
const editionStatus = readFileSync('webview-ui/src/components/molecules/EditionStatus.jsx', 'utf8');
const styles = readFileSync('webview-ui/src/styles.css', 'utf8');
const panel = readFileSync('src/presentation/reviewPanel.ts', 'utf8');
const watcher = readFileSync('src/infrastructure/gitSessionWatcher.ts', 'utf8');

test('presentation is edition-aware for Community and Premium', () => {
  assert.match(app, /edition-community/);
  assert.match(app, /edition-premium/);
  assert.match(leftbar, /EditionStatus/);
  assert.match(dashboard, /EditionStatus/);
  assert.doesNotMatch(rightbar, /EditionStatus/);
  assert.match(editionStatus, /Código permanece na máquina/);
  assert.match(editionStatus, /Colaboração remota é Premium/);
  assert.match(styles, /edition-status/);
});

test('production UI does not render hardcoded issue mocks', () => {
  assert.doesNotMatch(rightbar, /Inversão de Dependência/);
  assert.doesNotMatch(rightbar, /Muitas Responsabilidades/);
  assert.doesNotMatch(rightbar, /Tratamento de Erro/);
  assert.match(rightbar, /Nenhum problema real carregado/);
});

test('dashboard avoids artificial score before a real session exists', () => {
  assert.match(dashboard, /Aguardando análise/);
  assert.match(dashboard, /Não são exibidos scores, comentários ou problemas fictícios/);
  assert.doesNotMatch(dashboard, /metrics\.qualityScore \?\? 100/);
});

test('webview lifecycle disposes listeners, timers and decorations', () => {
  assert.match(panel, /panelDisposables/);
  assert.match(panel, /disposePanelResources/);
  assert.match(panel, /commentDecorations/);
  assert.match(panel, /clearTimeout\(this\.postStateTimer\)/);
  assert.match(panel, /font-src \$\{webview\.cspSource\} data:/);
});

test('git watcher avoids overlapping checks and aggressive polling', () => {
  assert.match(watcher, /isChecking/);
  assert.match(watcher, /hasPendingCheck/);
  assert.match(watcher, /lifecycle\.disposed/);
  assert.match(watcher, /intervalMs \?\? 12000/);
});
