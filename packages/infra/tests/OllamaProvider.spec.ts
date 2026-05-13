import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from '../src/OllamaProvider';

describe('OllamaProvider', () => {
  let provider: OllamaProvider;

  let mockHttpClient: {
    post: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn()
    };

    provider = new OllamaProvider(
      'http://localhost:11434',
      'llama3',
      mockHttpClient as any
    );
  });

  it('should analyze code using local Ollama', async () => {
    mockHttpClient.post.mockResolvedValue({
      data: {
        message: {
          content: JSON.stringify({
            findings: [
              {
                line: 1,
                message: '[Local] Use const',
                severity: 'info'
              }
            ]
          })
        }
      }
    });

    const result =
      await provider.analyzeCode({
        code: 'let x = 1;',
        filePath: 'test.ts',
        language: 'typescript'
      });

    expect(result.findings).toHaveLength(1);

    expect(
      result.findings[0].message
    ).toContain('[Local] Use const');
  });
});