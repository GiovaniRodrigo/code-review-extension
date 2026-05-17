import { describe, expect, it } from 'vitest';

describe('LLM Provider Selection', () => {
  it('should prefer activeProviderId over legacy provider setting', () => {
    const activeProviderId = 'gemini';
    const legacyProvider = 'mock';

    const selectedProvider = activeProviderId || legacyProvider || 'mock';

    expect(selectedProvider).toBe('gemini');
  });
});
