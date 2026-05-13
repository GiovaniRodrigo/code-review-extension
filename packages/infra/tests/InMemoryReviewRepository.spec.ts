import { describe, it, expect } from 'vitest';
import { InMemoryReviewRepository } from '../src/InMemoryReviewRepository';
import { ReviewSession } from '@code-review/domain';

describe('InMemoryReviewRepository', () => {
  it('should save and retrieve a session by branch', async () => {
    const repository = new InMemoryReviewRepository();
    const session: ReviewSession = {
      id: '1',
      branch: 'feat-test',
      findings: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repository.saveSession(session);
    const retrieved = await repository.getSessionByBranch('feat-test');

    expect(retrieved).toEqual(session);
  });

  it('should retrieve a session by id', async () => {
    const repository = new InMemoryReviewRepository();
    const session: ReviewSession = {
      id: 'unique-id',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repository.saveSession(session);
    const retrieved = await repository.getSessionById('unique-id');

    expect(retrieved).toEqual(session);
  });

  it('should return null if session is not found', async () => {
    const repository = new InMemoryReviewRepository();
    const retrieved = await repository.getSessionById('non-existent');
    expect(retrieved).toBeNull();
  });

  it('should delete a session', async () => {
    const repository = new InMemoryReviewRepository();
    const session: ReviewSession = {
      id: 'delete-me',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repository.saveSession(session);
    await repository.deleteSession(session.id);

    await expect(repository.getSessionById(session.id)).resolves.toBeNull();
  });
});
