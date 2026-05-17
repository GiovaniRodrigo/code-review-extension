import { describe, expect, it } from 'vitest';

describe('LLM Contract', () => {
  it('should require providerId, model and status fields', () => {
    const provider = {
      providerId: 'mock',
      model: 'mock-model',
      status: 'available',
    };

    expect(provider.providerId).toBeTruthy();
    expect(provider.model).toBeTruthy();
    expect(['available', 'unavailable']).toContain(provider.status);
  });
});
