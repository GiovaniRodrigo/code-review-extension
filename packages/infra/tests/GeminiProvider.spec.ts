import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiProvider } from '../src/GeminiProvider';
import { AIAnalysisInput } from '../src/index';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
    };
    provider = new GeminiProvider('fake-api-key', 'gemini-flash-latest', mockHttpClient);
  });

  it('should analyze code and return structured findings', async () => {
    const input: AIAnalysisInput = {
      code: 'let x = 1;',
      filePath: 'test.ts',
      language: 'typescript'
    };

    const mockApiResponse = {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              findings: [
                {
                  line: 1,
                  message: 'Use const instead of let',
                  severity: 'info',
                  category: 'code_smell',
                  confidence: 0.9,
                  suggestedFix: 'const x = 1;',
                  file: 'test.ts'
                }
              ],
              confidenceScore: 0.95
            })
          }]
        }
      }]
    };

    mockHttpClient.post.mockResolvedValue({ data: mockApiResponse });

    const result = await provider.analyzeCode(input);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].message).toContain('Use const');
    expect(result.confidenceScore).toBe(0.95);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      expect.stringContaining('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'),
      expect.objectContaining({
        contents: expect.arrayContaining([
          expect.objectContaining({
            parts: expect.arrayContaining([
              expect.objectContaining({ text: expect.stringContaining('let x = 1;') })
            ])
          })
        ])
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-goog-api-key': 'fake-api-key'
        })
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockHttpClient.post.mockRejectedValue(new Error('API Error'));

    const input: AIAnalysisInput = { code: '', filePath: 'err.ts' };
    
    await expect(provider.analyzeCode(input)).rejects.toThrow('Gemini Analysis failed: API Error');
  });

  it('should throw error if API key is missing', async () => {
    provider = new GeminiProvider('', 'gemini-flash-latest', mockHttpClient);
    const input: AIAnalysisInput = { code: 'some code', filePath: 'test.ts' };
    
    await expect(provider.analyzeCode(input)).rejects.toThrow('Gemini API Key is missing');
  });
});
