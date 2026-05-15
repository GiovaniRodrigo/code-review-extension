import { describe, expect, it, vi } from 'vitest';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('CodeReviewService', () => {
  it('deve criar uma sessão de review corretamente', async () => {
    const repository = { saveSession: vi.fn() } as unknown as CodeReviewRepositoryPort;
    const service = new CodeReviewService(repository);
    const branch = 'feat/test';

    const session = await service.create(branch);

    expect(session.branch).toBe(branch);
    expect(session.findings).toEqual([]);
    expect(repository.saveSession).toHaveBeenCalledWith(session);
  });
});
