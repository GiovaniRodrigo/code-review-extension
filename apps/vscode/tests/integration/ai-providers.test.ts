import { describe, it, expect, vi } from 'vitest';
import { MockAIProvider } from '@code-review/infra';

describe('Mock AI Provider Tests', () => {
  const provider = new MockAIProvider();

  it('should return valid findings for any code input', async () => {
    const result = await provider.analyzeCode({
      code: 'function test() { console.log("hello"); }',
      filePath: 'test.ts'
    });

    expect(result.findings).toBeDefined();
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.findings[0].message).toBeDefined();
    expect(result.findings[0].severity).toBeDefined();
  });

  it('should report healthy status', async () => {
    const status = await provider.checkHealth();
    expect(status.status).toBe('available');
  });

  it('should handle large context without crashing', async () => {
    const largeCode = 'x'.repeat(100000);
    const result = await provider.analyzeCode({
      code: largeCode,
      filePath: 'large.ts'
    });
    expect(result.findings).toBeDefined();
  });
});
