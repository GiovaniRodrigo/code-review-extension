import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiProvider } from '../src/GeminiProvider';
import { AIAnalysisInput } from '../src/index';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;
  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
    };
    provider = new GeminiProvider('fake-api-key', 'gemini-flash-latest', mockHttpClient);
  });

  describe('checkHealth', () => {
    it('should return available if model exists', async () => {
        mockHttpClient.get.mockResolvedValue({
            data: {
                models: [{ name: 'models/gemini-flash-latest' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('available');
    });

    it('should return model_not_found if model is missing', async () => {
        mockHttpClient.get.mockResolvedValue({
            data: {
                models: [{ name: 'models/other-model' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('model_not_found');
    });

    it('should return unauthorized if 403', async () => {
        const error: any = new Error('Forbidden');
        error.response = { status: 403 };
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
        provider = new GeminiProvider(async () => 'dynamic-key', 'gemini-flash-latest', mockHttpClient);
        mockHttpClient.get.mockResolvedValue({
            data: {
                models: [{ name: 'models/gemini-flash-latest' }]
            }
        });

        const status = await provider.checkHealth();
        expect(status.status).toBe('available');
    });
        it('should return unauthorized if 401', async () => {
        const error: any = new Error('Unauthorized');
        error.response = { status: 401 };
        mockHttpClient.get.mockRejectedValue(error);

        const status = await provider.checkHealth();
        expect(status.status).toBe('unauthorized');
        });

        it('should return model_not_found if response has no models', async () => {
        mockHttpClient.get.mockResolvedValue({ data: {} });
        const status = await provider.checkHealth();
        expect(status.status).toBe('model_not_found');
        });
        });

        describe('analyzeCode', () => {
        it('should handle empty candidates from Gemini', async () => {
        mockHttpClient.post.mockResolvedValue({ data: { candidates: [] } });
        await expect(provider.analyzeCode({ code: '', filePath: '' })).rejects.toThrow('No candidates returned');
        });

        it('should handle empty content from Gemini', async () => {
        mockHttpClient.post.mockResolvedValue({ data: { candidates: [{ content: { parts: [{ text: '' }] } }] } });
        await expect(provider.analyzeCode({ code: '', filePath: '' })).rejects.toThrow('Empty response');
        });

    it('should support apiKey as a function in analyzeCode', async () => {
        provider = new GeminiProvider(async () => 'dynamic-key', 'gemini-flash-latest', mockHttpClient);
        const mockApiResponse = {
            candidates: [{ content: { parts: [{ text: JSON.stringify({ findings: [], confidenceScore: 1 }) }] } }]
        };
        mockHttpClient.post.mockResolvedValue({ data: mockApiResponse });

        await provider.analyzeCode({ code: '', filePath: '' });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Object),
            expect.objectContaining({
                headers: expect.objectContaining({ 'x-goog-api-key': 'dynamic-key' })
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
});
