import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from '../src/OllamaProvider';
import { AIAnalysisInput } from '../src/index';

describe('OllamaProvider', () => {
  let provider: OllamaProvider;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
    };
    provider = new OllamaProvider('http://localhost:11434', 'llama3', mockHttpClient);
  });

  it('should analyze code using local Ollama and return structured findings', async () => {
    const input: AIAnalysisInput = {
      code: 'let x = 1;',
      filePath: 'test.ts',
      language: 'typescript'
    };

    const mockApiResponse = {
      message: {
        content: JSON.stringify({
          findings: [
            {
              line: 1,
              message: '[Local] Use const',
              severity: 'info'
            }
          ],
          confidenceScore: 0.85
        })
      }
    };

    mockHttpClient.post.mockResolvedValue({ data: mockApiResponse });

    const result = await provider.analyzeCode(input);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].message).toContain('[Local] Use const');
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'http://localhost:11434/api/chat',
      expect.objectContaining({
        model: 'llama3',
        messages: expect.arrayContaining([
          expect.objectContaining({ content: expect.stringContaining('let x = 1;') })
        ])
      })
    );
  });
});
