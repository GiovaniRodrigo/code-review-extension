import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from '../src/OllamaProvider';

describe('OllamaProvider', () => {
  let provider: OllamaProvider;

  let mockHttpClient: {
    post: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
    };

    provider = new OllamaProvider(
      'http://localhost:11434',
      'llama3',
      mockHttpClient as any
    );
  });

  describe('checkHealth', () => {
    it('should return available if model exists', async () => {
      mockHttpClient.get.mockResolvedValue({
        data: {
          models: [{ name: 'llama3:latest' }]
        }
      });

      const status = await provider.checkHealth();
      expect(status.status).toBe('available');
    });

    it('should return model_not_found if model does not exist', async () => {
      mockHttpClient.get.mockResolvedValue({
        data: {
          models: [{ name: 'mistral:latest' }]
        }
      });

      const status = await provider.checkHealth();
      expect(status.status).toBe('model_not_found');
    });

    it('should return timeout if request times out', async () => {
      const error: any = new Error('timeout');
      error.code = 'ECONNABORTED';
      mockHttpClient.get.mockRejectedValue(error);

      const status = await provider.checkHealth();
      expect(status.status).toBe('timeout');
    });

    it('should return unavailable on other errors', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Connection Refused'));

      const status = await provider.checkHealth();
      expect(status.status).toBe('unavailable');
      expect(status.message).toBe('Connection Refused');
    });
  });

  describe('analyzeCode', () => {
    it('should handle invalid JSON from Ollama', async () => {
        mockHttpClient.post.mockResolvedValue({
            data: { response: '{ invalid json }' }
        });

        const result = await provider.analyzeCode({ code: '', filePath: '' });
        expect(result.findings).toHaveLength(1);
        expect(result.findings[0].suggestedFix).toContain('JSON inválido');
    });

    it('should handle valid JSON but missing findings field', async () => {
        mockHttpClient.post.mockResolvedValue({
            data: { response: JSON.stringify({ wrong: [] }) }
        });

        const result = await provider.analyzeCode({ code: '', filePath: '' });
        expect(result.findings).toHaveLength(1);
        expect(result.findings[0].suggestedFix).toContain('fora do schema esperado');
    });

    it('should throw error if post fails', async () => {
        mockHttpClient.post.mockRejectedValue(new Error('Network Error'));
        await expect(provider.analyzeCode({ code: '', filePath: '' })).rejects.toThrow('Local AI analysis failed');
    });
    it('should analyze code using local Ollama', async () => {
      mockHttpClient.post.mockResolvedValue({
        data: {
          response: JSON.stringify({
            findings: [
              {
                line: 1,
                message: '[Local] Use const',
                severity: 'info'
              }
            ],
            confidenceScore: 0.9
          })
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
});
