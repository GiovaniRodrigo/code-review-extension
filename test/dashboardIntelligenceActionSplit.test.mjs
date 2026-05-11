import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dashboard = fs.readFileSync('webview-ui/src/components/organisms/DashboardCenter.jsx', 'utf8');
const intelligence = fs.readFileSync('webview-ui/src/components/organisms/IntelligenceCenter.jsx', 'utf8');
const docs = fs.readFileSync('docs/DASHBOARD_INTELLIGENCE_ACTION_SPLIT.md', 'utf8');

test('dashboard CTA creates a session instead of generating AI comments', () => {
  assert.match(dashboard, /dashboard\.newSession/);
  assert.match(dashboard, /onStartReview/);
  assert.doesNotMatch(dashboard, /generateAIReviewComments/);
  assert.doesNotMatch(dashboard, /handleRunReview/);
});

test('intelligence owns AI comment generation action', () => {
  assert.match(intelligence, /Gerar comentários IA/);
  assert.match(intelligence, /onRunReview\?\.\(\{ id: session\?\.id \}\)/);
  assert.match(intelligence, /disabled=\{!canGenerateAI\}/);
});

test('action split is documented', () => {
  assert.match(docs, /Dashboard -> Nova Sessão/);
  assert.match(docs, /Intelligence -> Gerar comentários IA/);
});
