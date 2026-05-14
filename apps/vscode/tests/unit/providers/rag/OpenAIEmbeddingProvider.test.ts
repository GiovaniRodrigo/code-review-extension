import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as https from 'node:https';
import { OpenAIEmbeddingProvider } from '../../../../src/services/rag/providers/OpenAIEmbeddingProvider';
import { EventEmitter } from 'node:events';

vi.mock('node:https');

describe('OpenAIEmbeddingProvider', () => {
  let mockSecrets: any;
  let provider: OpenAIEmbeddingProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSecrets = {
      get: vi.fn()
    };
    provider = new OpenAIEmbeddingProvider(mockSecrets);
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should throw error if API key is missing', async () => {
    mockSecrets.get.mockResolvedValue(undefined);
    await expect(provider.generateEmbedding('test')).rejects.toThrow('OpenAI API key não configurada.');
  });

  it('should generate embedding successfully', async () => {
    mockSecrets.get.mockResolvedValue('fake-key');
    const mockEmbedding = [0.1, 0.2];
    const mockResponse = new EventEmitter() as any;
    const mockRequest = new EventEmitter() as any;
    mockRequest.write = vi.fn();
    mockRequest.end = vi.fn();

    vi.mocked(https.request).mockImplementation((options, callback: any) => {
        callback(mockResponse);
        return mockRequest;
    });

    const promise = provider.generateEmbedding('test');
    
    process.nextTick(() => {
        mockResponse.emit('data', JSON.stringify({ data: [{ embedding: mockEmbedding }] }));
        mockResponse.emit('end');
    });

    const result = await promise;
    expect(result).toEqual(mockEmbedding);
    expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({ hostname: 'api.openai.com' }),
        expect.any(Function)
    );
  });

  it('should handle API error', async () => {
    mockSecrets.get.mockResolvedValue('fake-key');
    const mockResponse = new EventEmitter() as any;
    const mockRequest = new EventEmitter() as any;
    mockRequest.write = vi.fn();
    mockRequest.end = vi.fn();

    vi.mocked(https.request).mockImplementation((options, callback: any) => {
        callback(mockResponse);
        return mockRequest;
    });

    const promise = provider.generateEmbedding('test');
    
    process.nextTick(() => {
        mockResponse.emit('data', JSON.stringify({ error: { message: 'invalid key' } }));
        mockResponse.emit('end');
    });

    await expect(promise).rejects.toThrow('invalid key');
  });
});
