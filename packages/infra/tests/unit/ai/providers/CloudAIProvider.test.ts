import { describe, it, expect } from 'vitest';
import { CloudAIProvider } from '../../../../src/ai/providers/CloudAIProvider';

describe('CloudAIProvider', () => {
  it('should return a placeholder finding when analyzing code', async () => {
    const provider = new CloudAIProvider();
    const result = await provider.analyzeCode({
      filePath: 'test.ts',
      content: 'test',
      instructions: 'test'
    });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].message).toContain('not configured');
  });
});
