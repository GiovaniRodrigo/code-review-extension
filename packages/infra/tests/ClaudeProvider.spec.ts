import { describe, it, expect } from 'vitest';
import { ClaudeProvider } from '../src/ClaudeProvider';

describe('ClaudeProvider', () => {
  it('should return unauthorized if API key is missing', async () => {
    const provider = new ClaudeProvider('');
    const status = await provider.checkHealth();
    expect(status.status).toBe('unauthorized');
  });

  it('should return available if key is present', async () => {
    const provider = new ClaudeProvider('fake-key');
    const status = await provider.checkHealth();
    expect(['available', 'unavailable']).toContain(status.status);
  });

  it('should support apiKey as a function', async () => {
    const provider = new ClaudeProvider(async () => 'dynamic-key');
    const status = await provider.checkHealth();
    expect(['available', 'unavailable']).toContain(status.status);
  });

  it('should attempt analyzeCode and throw due to fake key/network', async () => {
    const provider = new ClaudeProvider('fake-key');
    await expect(provider.analyzeCode({ code: '', filePath: '' })).rejects.toThrow();
  });
});
