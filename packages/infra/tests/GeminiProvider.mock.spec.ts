import { describe, it, expect, vi } from 'vitest';
import { GeminiProvider } from '../src/GeminiProvider';

describe('GeminiProvider Mock Test', () => {
  it('should handle the specific Gemini API response format provided by user', async () => {
    // This is the mock data based on the user's curl output
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  findings: [
                    {
                      file: "test.ts",
                      line: 1,
                      severity: "warning",
                      category: "code_smell",
                      message: "AI learns from **vast amounts of data** to identify **patterns** and make **predictions**.",
                      confidence: 0.9
                    }
                  ],
                  confidenceScore: 0.95
                })
              }
            ],
            role: "model"
          },
          finishReason: "STOP",
          index: 0
        }
      ],
      usageMetadata: {
        promptTokenCount: 8,
        candidatesTokenCount: 19,
        totalTokenCount: 232
      }
    };

    const mockHttpClient = {
      post: vi.fn().mockResolvedValue({ data: mockGeminiResponse }),
      get: vi.fn()
    };

    const provider = new GeminiProvider('fake-key', 'gemini-flash-latest', mockHttpClient as any);
    const result = await provider.analyzeCode({
      code: 'Explain how AI works',
      filePath: 'test.ts'
    });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].message).toContain('AI learns from **vast amounts of data**');
    expect(result.confidenceScore).toBe(0.95);
  });
});
