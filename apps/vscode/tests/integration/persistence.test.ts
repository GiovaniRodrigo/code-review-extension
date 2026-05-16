import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileReviewRepository } from '@code-review/infra';
import { ReviewSession } from '@code-review/domain';
import { rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

describe('Persistence (FileReviewRepository) Tests', () => {
  const testDir = join(__dirname, 'temp-storage');
  let repository: FileReviewRepository;

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
    repository = new FileReviewRepository(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  const createMockSession = (id: string, branch: string): ReviewSession => ({
    id,
    branch,
    findings: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  it('should save and retrieve a session by ID', async () => {
    const session = createMockSession('session-1', 'main');
    await repository.saveSession(session);

    const retrieved = await repository.getSessionById('session-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.branch).toBe('main');
  });

  it('should retrieve latest session by branch', async () => {
    const session1 = createMockSession('session-1', 'feature-x');
    const session2 = createMockSession('session-2', 'feature-x');
    
    // Ensure session2 is "newer"
    session2.updatedAt = new Date(Date.now() + 1000);

    await repository.saveSession(session1);
    await repository.saveSession(session2);

    const retrieved = await repository.getSessionByBranch('feature-x');
    expect(retrieved?.id).toBe('session-2');
  });

  it('should handle missing sessions file gracefully', async () => {
    const retrieved = await repository.getAllSessions();
    expect(retrieved).toEqual([]);
  });

  it('should delete a session', async () => {
    const session = createMockSession('session-to-delete', 'main');
    await repository.saveSession(session);
    await repository.deleteSession('session-to-delete');

    const retrieved = await repository.getSessionById('session-to-delete');
    expect(retrieved).toBeNull();
  });
});
