import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { test } from 'node:test';
import esbuild from 'esbuild';

await mkdir('.tmp-tests', { recursive: true });
await esbuild.build({
  entryPoints: ['src/editions/community/CommunityEditionRuntime.ts'],
  bundle: true,
  outfile: '.tmp-tests/communityEdition.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/editions/premium/PremiumEditionRuntime.ts'],
  bundle: true,
  outfile: '.tmp-tests/premiumEditionRuntime.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/editions/shared/EditionPresentation.ts'],
  bundle: true,
  outfile: '.tmp-tests/editionPresentation.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/graph/LocalGraphProvider.ts'],
  bundle: true,
  outfile: '.tmp-tests/localGraphProvider.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/analyzer/ArchitectureAnalyzer.ts'],
  bundle: true,
  outfile: '.tmp-tests/architectureAnalyzer.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/workflows/WorkflowEngine.ts'],
  bundle: true,
  outfile: '.tmp-tests/workflowEngine.mjs',
  platform: 'node',
  format: 'esm'
});

const { createCommunityEditionRuntime } = await import('../.tmp-tests/communityEdition.mjs');
const { createPremiumEditionRuntime } = await import('../.tmp-tests/premiumEditionRuntime.mjs');
const { buildEditionPresentationState } = await import('../.tmp-tests/editionPresentation.mjs');
const { LocalGraphProvider } = await import('../.tmp-tests/localGraphProvider.mjs');
const { ArchitectureAnalyzer } = await import('../.tmp-tests/architectureAnalyzer.mjs');
const { WorkflowEngine } = await import('../.tmp-tests/workflowEngine.mjs');

test('community edition communicates local-first capabilities', () => {
  const runtime = createCommunityEditionRuntime();
  const presentation = buildEditionPresentationState(runtime);

  assert.equal(runtime.id, 'community');
  assert.equal(runtime.capabilities.localAI, true);
  assert.equal(runtime.capabilities.remoteSync, false);
  assert.equal(presentation.badge, 'Community');
  assert.match(presentation.privacyMessage, /máquina/);
});

test('premium edition exposes cloud collaboration capabilities by tier', () => {
  const runtime = createPremiumEditionRuntime('team');
  const presentation = buildEditionPresentationState(runtime);

  assert.equal(runtime.id, 'premium');
  assert.equal(runtime.plan, 'team');
  assert.equal(runtime.capabilities.remoteSync, true);
  assert.equal(runtime.capabilities.cloudAI, true);
  assert.equal(runtime.capabilities.sharedGraph, true);
  assert.match(presentation.badge, /Premium team/);
});

test('graph engine builds dependency context from AST', async () => {
  const provider = new LocalGraphProvider();
  const graph = await provider.buildFromAst([{
    kind: 'SourceFile',
    path: 'src/app.ts',
    content: "import x from './infra'; class App {}",
    line: 1,
    children: [
      { kind: 'ImportDeclaration', value: './infra', line: 1, children: [] },
      { kind: 'ClassDeclaration', name: 'App', line: 1, children: [] }
    ]
  }]);

  assert.ok(graph.nodes.some((node) => node.id === 'file:src/app.ts'));
  assert.ok(graph.edges.some((edge) => edge.type === 'depends_on'));
});

test('analyzer returns human-approved automated suggestions', async () => {
  const analyzer = new ArchitectureAnalyzer();
  const result = await analyzer.analyze({
    context: { session: { changedFiles: ['src/app.ts'] }, changedFiles: ['src/app.ts'] },
    graph: {
      nodes: [],
      edges: [{ from: 'file:src/app.ts', to: 'dependency:../presentation/view', type: 'depends_on' }]
    }
  });

  assert.equal(result.suggestedComments.length, 1);
  assert.equal(result.suggestedComments[0].requiresHumanApproval, true);
});

test('workflow engine executes only matching triggers', async () => {
  const engine = new WorkflowEngine();
  const executed = [];
  engine.registerAction({ id: 'run.ai', execute: async () => { executed.push('run.ai'); } });

  const skipped = await engine.run({ id: 'w1', name: 'AI Review', on: ['review.started'], actions: ['run.ai'] }, { event: 'comment.created', payload: {} });
  const matched = await engine.run({ id: 'w1', name: 'AI Review', on: ['review.started'], actions: ['run.ai'] }, { event: 'review.started', payload: {} });

  assert.deepEqual(skipped, []);
  assert.deepEqual(matched, ['run.ai']);
  assert.deepEqual(executed, ['run.ai']);
});
