import { describe, it, expect, beforeEach } from 'vitest';
import { ContextEngine } from '../src/ContextEngine';
import { InMemoryReviewRepository } from '../../infra/src/InMemoryReviewRepository';
import { ReviewSession } from '@code-review/domain';

describe('ContextEngine', () => {
  let repository: InMemoryReviewRepository;
  let engine: ContextEngine;

  beforeEach(() => {
    repository = new InMemoryReviewRepository();
    engine = new ContextEngine(repository);
  });

  it('should return empty context when no history exists', async () => {
    const context = await engine.buildContext('test.ts');
    expect(context).toBe('');
  });

  it('should include approved and rejected findings in context', async () => {
    const session: ReviewSession = {
      id: '1',
      branch: 'main',
      findings: [
        { id: 'f1', file: 'test.ts', line: 10, message: 'Good report', severity: 'error', status: 'approved' },
        { id: 'f2', file: 'test.ts', line: 20, message: 'Bad report', severity: 'warning', status: 'rejected' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await repository.saveSession(session);
    const context = await engine.buildContext('test.ts');

    expect(context).toContain('Approved findings');
    expect(context).toContain('Good report');
    expect(context).toContain('Rejected findings');
    expect(context).toContain('Bad report');
  });

  it('should limit the number of findings in context', async () => {
    const findings = Array.from({ length: 10 }, (_, i) => ({
      id: `f${i}`,
      file: 'test.ts',
      line: i,
      message: `Report ${i}`,
      severity: 'info' as const,
      status: 'approved' as const
    }));

    const session: ReviewSession = {
      id: '1',
      branch: 'main',
      findings,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await repository.saveSession(session);
    const context = await engine.buildContext('test.ts');

    // Should only contain the last 5
    expect(context).not.toContain('Report 0');
    expect(context).toContain('Report 9');
    expect(context).toContain('Report 5');
  });
});
