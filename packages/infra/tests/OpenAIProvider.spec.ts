import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '../src/OpenAIProvider';
import { AIAnalysisInput } from '../src/index';

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
    };
    provider = new OpenAIProvider('fake-api-key', mockHttpClient);
  });

  it('should analyze code and return structured findings', async () => {
    const input: AIAnalysisInput = {
      code: 'let x = 1;',
      filePath: 'test.ts',
      language: 'typescript'
    };

    const mockApiResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            findings: [
              {
                line: 1,
                message: 'Use const instead of let',
                severity: 'info',
                suggestedFix: 'const x = 1;'
              }
            ],
            confidenceScore: 0.95
          })
        }
      }]
    };

    mockHttpClient.post.mockResolvedValue({ data: mockApiResponse });

    const result = await provider.analyzeCode(input);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].message).toContain('Use const');
    expect(result.confidenceScore).toBe(0.95);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ content: expect.stringContaining('let x = 1;') })
        ])
      }),
      expect.any(Object)
    );
  });

  it('should handle API errors gracefully', async () => {
    mockHttpClient.post.mockRejectedValue(new Error('API Error'));

    const input: AIAnalysisInput = { code: '', filePath: 'err.ts' };
    
    await expect(provider.analyzeCode(input)).rejects.toThrow('AI Analysis failed: API Error');
  });
});
