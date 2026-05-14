import { describe, it, expect, vi } from 'vitest';
import * as https from 'https';
import { OpenAIEmbeddingProvider } from '../../../../src/rag/providers/OpenAIEmbeddingProvider';
import { EventEmitter } from 'events';

vi.mock('https');

describe('OpenAIEmbeddingProvider', () => {
  it('should generate embedding using https request', async () => {
    const mockSecrets = { get: vi.fn().mockResolvedValue('test-key') };
    const provider = new OpenAIEmbeddingProvider(mockSecrets as any);
    
    const mockResponse = new EventEmitter() as any;
    const mockRequest = new EventEmitter() as any;
    mockRequest.write = vi.fn();
    mockRequest.end = vi.fn();
    
    vi.mocked(https.request).mockImplementation((_opts, callback: any) => {
        setImmediate(() => {
            callback(mockResponse);
            mockResponse.emit('data', JSON.stringify({ data: [{ embedding: [0.1, 0.2] }] }));
            mockResponse.emit('end');
        });
        return mockRequest;
    });

    const result = await provider.generateEmbedding('test');
    expect(result).toEqual([0.1, 0.2]);
    expect(mockRequest.write).toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const mockSecrets = { get: vi.fn().mockResolvedValue('test-key') };
    const provider = new OpenAIEmbeddingProvider(mockSecrets as any);
    
    const mockResponse = new EventEmitter() as any;
    const mockRequest = new EventEmitter() as any;
    mockRequest.write = vi.fn();
    mockRequest.end = vi.fn();
    
    vi.mocked(https.request).mockImplementation((_opts, callback: any) => {
        setImmediate(() => {
            callback(mockResponse);
            mockResponse.emit('data', JSON.stringify({ error: { message: 'invalid key' } }));
            mockResponse.emit('end');
        });
        return mockRequest;
    });

    await expect(provider.generateEmbedding('test')).rejects.toThrow('invalid key');
  });

  it('should throw if API key is missing', async () => {
    const mockSecrets = { get: vi.fn().mockResolvedValue(undefined) };
    const provider = new OpenAIEmbeddingProvider(mockSecrets as any);
    await expect(provider.generateEmbedding('test')).rejects.toThrow('não configurada');
  });
});
