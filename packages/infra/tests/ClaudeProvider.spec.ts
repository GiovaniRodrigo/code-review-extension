import { describe, it, expect } from 'vitest';
import { ClaudeProvider } from '../src/ClaudeProvider';

describe('ClaudeProvider', () => {
  it('should return unauthorized if API key is missing', async () => {
    const provider = new ClaudeProvider('');
    const status = await provider.checkHealth();
    expect(status.status).toBe('unauthorized');
  });

  it('should return unavailable for now', async () => {
    const provider = new ClaudeProvider('fake-key');
    const status = await provider.checkHealth();
    expect(status.status).toBe('unavailable');
    expect(status.message).toContain('pending');
  });

  it('should support apiKey as a function', async () => {
    const provider = new ClaudeProvider(async () => 'dynamic-key');
    const status = await provider.checkHealth();
    expect(status.status).toBe('unavailable');
  });

  it('should throw error on analyzeCode', async () => {
    const provider = new ClaudeProvider('fake-key');
    await expect(provider.analyzeCode({ code: '', filePath: '' })).rejects.toThrow('not implemented');
  });
});
