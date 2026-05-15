import { describe, it, expect, vi } from 'vitest';
import { SelectAIProviderUseCase } from '../../../../../src/application/use-cases/ai/SelectAIProviderUseCase';

describe('SelectAIProviderUseCase', () => {
  it('should call save settings function', async () => {
    const useCase = new SelectAIProviderUseCase();
    const saveSettings = vi.fn();
    
    await useCase.execute({ providerId: 'test-id' }, saveSettings);
    
    expect(saveSettings).toHaveBeenCalledWith('test-id');
  });
});
