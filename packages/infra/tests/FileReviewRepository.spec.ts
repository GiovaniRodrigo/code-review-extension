import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ReviewSession } from '@code-review/domain';
import { FileReviewRepository } from '../src/FileReviewRepository';

describe('FileReviewRepository', () => {
  let storageDir: string;

  beforeEach(async () => {
    storageDir = await mkdtemp(join(tmpdir(), 'code-review-extension-'));
  });

  afterEach(async () => {
    await rm(storageDir, { recursive: true, force: true });
  });

  it('should persist and restore sessions from disk', async () => {
    const repository = new FileReviewRepository(storageDir);
    const session: ReviewSession = {
      id: 'session-1',
      branch: 'feat/mvp',
      findings: [
        {
          id: 'finding-1',
          file: 'src/test.ts',
          line: 1,
          message: 'Use const',
          severity: 'info',
          status: 'pending',
          confidenceScore: 0.9
        }
      ],
      comments: [],
      createdAt: new Date('2026-05-12T10:00:00.000Z'),
      updatedAt: new Date('2026-05-12T10:01:00.000Z')
    };

    await repository.saveSession(session);

    const restoredRepository = new FileReviewRepository(storageDir);
    const restored = await restoredRepository.getSessionById('session-1');

    expect(restored).toEqual(session);
  });

  it('should return the latest session for a branch', async () => {
    const repository = new FileReviewRepository(storageDir);
    const oldSession: ReviewSession = {
      id: 'old',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date('2026-05-12T10:00:00.000Z'),
      updatedAt: new Date('2026-05-12T10:00:00.000Z')
    };
    const newSession: ReviewSession = {
      id: 'new',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date('2026-05-12T11:00:00.000Z'),
      updatedAt: new Date('2026-05-12T11:00:00.000Z')
    };

    await repository.saveSession(oldSession);
    await repository.saveSession(newSession);

    await expect(repository.getSessionByBranch('main')).resolves.toEqual(newSession);
  });

  it('should delete a persisted session', async () => {
    const repository = new FileReviewRepository(storageDir);
    const session: ReviewSession = {
      id: 'session-to-delete',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date('2026-05-12T10:00:00.000Z'),
      updatedAt: new Date('2026-05-12T10:00:00.000Z')
    };

    await repository.saveSession(session);
    await repository.deleteSession(session.id);

    await expect(repository.getSessionById(session.id)).resolves.toBeNull();
  });
});
