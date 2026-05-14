import { describe, it, expect } from 'vitest';
import { SetupRagUseCase } from '../../../../../src/application/use-cases/rag/SetupRagUseCase';

describe('SetupRagUseCase', () => {
  it('should return enabled true', async () => {
    const useCase = new SetupRagUseCase();
    const result = await useCase.execute();
    expect(result.enabled).toBe(true);
  });
});
