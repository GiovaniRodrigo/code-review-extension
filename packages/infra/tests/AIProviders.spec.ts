import { describe, it, expect, vi } from 'vitest';
import { AIProviderRegistry, AIProviderPort } from '@code-review/core';
import { FallbackAIProvider } from '../src/FallbackAIProvider';

describe('AIProviderRegistry', () => {
  it('should register and retrieve providers', async () => {
    const registry = new AIProviderRegistry();
    const mockProvider: AIProviderPort = { analyzeCode: vi.fn(), checkHealth: vi.fn() };
    
    registry.register('openai', mockProvider);
    registry.setActiveProvider('openai');
    
    // Core AIProviderRegistry implements AIProviderPort
    await registry.checkHealth();
    expect(mockProvider.checkHealth).toHaveBeenCalled();
  });

  it('should throw if active provider not found', () => {
    const registry = new AIProviderRegistry();
    expect(() => registry.setActiveProvider('ghost')).toThrow();
  });
});

describe('FallbackAIProvider', () => {
  it('should use primary provider if it succeeds', async () => {
    const primary: AIProviderPort = { 
        analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 1 }),
        checkHealth: vi.fn().mockResolvedValue({ status: 'available' })
    };
    const secondary: AIProviderPort = { 
        analyzeCode: vi.fn(),
        checkHealth: vi.fn()
    };
    const fallback = new FallbackAIProvider(primary, secondary);
    
    const result = await fallback.analyzeCode({ code: '', filePath: '', branch: 'main' } as any);
    
    expect(result.confidenceScore).toBe(1);
    expect(primary.analyzeCode).toHaveBeenCalled();
    expect(secondary.analyzeCode).not.toHaveBeenCalled();
  });

  it('should use secondary provider if primary fails', async () => {
    const primary: AIProviderPort = { 
        analyzeCode: vi.fn().mockRejectedValue(new Error('API Down')),
        checkHealth: vi.fn().mockResolvedValue({ status: 'unavailable' })
    };
    const secondary: AIProviderPort = { 
        analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 0.5 }),
        checkHealth: vi.fn().mockResolvedValue({ status: 'available' })
    };
    const onFallback = vi.fn();
    const fallback = new FallbackAIProvider(primary, secondary, onFallback);
    
    const result = await fallback.analyzeCode({ code: '', filePath: '', branch: 'main' } as any);
    
    expect(result.confidenceScore).toBe(0.5);
    expect(primary.analyzeCode).toHaveBeenCalled();
    expect(secondary.analyzeCode).toHaveBeenCalled();
    expect(onFallback).toHaveBeenCalled();
  });
});
