import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import test from 'node:test';
import esbuild from 'esbuild';

await mkdir('.tmp-tests', { recursive: true });
await esbuild.build({
  entryPoints: ['src/application/PremiumReviewSyncService.ts'],
  bundle: true,
  outfile: '.tmp-tests/premiumReviewSyncService.mjs',
  platform: 'node',
  format: 'esm'
});
await esbuild.build({
  entryPoints: ['src/domain/PremiumPlan.ts'],
  bundle: true,
  outfile: '.tmp-tests/premiumPlan.mjs',
  platform: 'node',
  format: 'esm'
});

const { PremiumReviewSyncService } = await import('../.tmp-tests/premiumReviewSyncService.mjs');
const { getPremiumFeatureFlags, assertPremiumFeature } = await import('../.tmp-tests/premiumPlan.mjs');

test('community edition keeps local reviews enabled and blocks premium-only features', () => {
  const flags = getPremiumFeatureFlags({ edition: 'community' });

  assert.equal(flags.localReviews, true);
  assert.equal(flags.remoteDatabase, false);
  assert.throws(() => assertPremiumFeature({ edition: 'community' }, 'remoteDatabase'), /Recurso premium necessario/);
});

test('premium edition enables remote database and collaboration capabilities', () => {
  const flags = getPremiumFeatureFlags({ edition: 'premium' });

  assert.equal(flags.remoteDatabase, true);
  assert.equal(flags.realtimeCollaboration, true);
  assert.equal(flags.organizationAnalytics, true);
});

test('community sync exports a local snapshot without requiring paid database', async () => {
  const repository = new MemoryRepository();
  const service = new PremiumReviewSyncService(repository, { edition: 'community' });

  const result = await service.sync('/tmp/local-snapshot.json');

  assert.equal(result.mode, 'community-local');
  assert.equal(result.target, '/tmp/local-snapshot.json');
  assert.equal(result.sessionsSynced, 1);
});

test('premium sync requires API URL and token before using the paid database', async () => {
  const service = new PremiumReviewSyncService(new MemoryRepository(), { edition: 'premium' });

  await assert.rejects(() => service.sync(), /premiumApiUrl.*premiumToken/);
});

test('premium sync sends sessions to the remote database client', async () => {
  const client = new RecordingRemoteClient();
  const service = new PremiumReviewSyncService(
    new MemoryRepository(),
    {
      edition: 'premium',
      organizationId: 'org-1',
      workspaceId: 'workspace-1',
      remoteApiUrl: 'https://premium.example.test',
      accessToken: 'secret'
    },
    client
  );

  const result = await service.sync();

  assert.equal(result.mode, 'premium-remote');
  assert.equal(result.target, 'premium://org-1/workspace-1');
  assert.equal(client.lastInput.organizationId, 'org-1');
  assert.equal(client.lastInput.workspaceId, 'workspace-1');
  assert.equal(client.lastInput.sessions.length, 1);
});

class MemoryRepository {
  constructor() {
    this.sessions = [{ id: 'review-1', sourceBranch: 'feature/premium' }];
  }

  async list() {
    return this.sessions;
  }

  async syncToRemote(targetPath) {
    return targetPath ?? '.code-review-sync.json';
  }
}

class RecordingRemoteClient {
  async syncSessions(input) {
    this.lastInput = input;
    return {
      remoteDatabase: `premium://${input.organizationId}/${input.workspaceId}`,
      syncedAt: '2026-05-10T00:00:00.000Z'
    };
  }
}
