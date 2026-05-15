import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '../src/OpenAIProvider';
import { AIAnalysisInput } from '../src/index';

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
    };
    provider = new OpenAIProvider('fake-api-key', 'gpt-4o-mini', mockHttpClient);
  });

  describe('checkHealth', () => {
    it('should return available if model exists', async () => {
        mockHttpClient.get.mockResolvedValue({
            data: {
                data: [{ id: 'gpt-4o-mini' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('available');
    });

    it('should return model_not_found if model is missing', async () => {
        mockHttpClient.get.mockResolvedValue({
            data: {
                data: [{ id: 'gpt-3.5-turbo' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('model_not_found');
    });

    it('should return unauthorized if 401', async () => {
        const error: any = new Error('Unauthorized');
        error.response = { status: 401 };
        mockHttpClient.get.mockRejectedValue(error);

        const status = await provider.checkHealth();
        expect(status.status).toBe('unauthorized');
    });

    it('should return timeout if request times out', async () => {
        const error: any = new Error('timeout');
        error.code = 'ECONNABORTED';
        mockHttpClient.get.mockRejectedValue(error);

        const status = await provider.checkHealth();
        expect(status.status).toBe('timeout');
    });

    it('should support apiKey as a function', async () => {
        provider = new OpenAIProvider(async () => 'dynamic-key', 'gpt-4o-mini', mockHttpClient);
        mockHttpClient.get.mockResolvedValue({
            data: {
                data: [{ id: 'gpt-4o-mini' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('available');
    });
  });

  describe('analyzeCode', () => {
    it('should support apiKey as a function in analyzeCode', async () => {
        provider = new OpenAIProvider(async () => 'dynamic-key', 'gpt-4o-mini', mockHttpClient);
        const mockApiResponse = {
            choices: [{ message: { content: JSON.stringify({ findings: [], confidenceScore: 1 }) } }]
        };
        mockHttpClient.post.mockResolvedValue({ data: mockApiResponse });

        await provider.analyzeCode({ code: '', filePath: '' });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Object),
            expect.objectContaining({
                headers: expect.objectContaining({ 'Authorization': 'Bearer dynamic-key' })
            })
        );
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
    });

    it('should handle API errors gracefully', async () => {
        mockHttpClient.post.mockRejectedValue(new Error('API Error'));

        const input: AIAnalysisInput = { code: '', filePath: 'err.ts' };
        
        await expect(provider.analyzeCode(input)).rejects.toThrow('AI Analysis failed: API Error');
    });
  });
});
