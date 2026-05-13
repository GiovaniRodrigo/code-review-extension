import { describe, it, expect, vi } from 'vitest';
import { AIProviderRegistry } from '../src/AIProviderRegistry';
import { FallbackAIProvider } from '../src/FallbackAIProvider';
import { AIProvider } from '../src/interfaces';

describe('AIProviderRegistry', () => {
  it('should register and retrieve providers', () => {
    const registry = new AIProviderRegistry();
    const mockProvider: AIProvider = { analyzeCode: vi.fn() };
    
    registry.register('openai', mockProvider);
    expect(registry.getProvider('openai')).toBe(mockProvider);
    expect(registry.listProviders()).toContain('openai');
  });

  it('should return default provider if none specified', () => {
    const registry = new AIProviderRegistry();
    const p1: AIProvider = { analyzeCode: vi.fn() };
    const p2: AIProvider = { analyzeCode: vi.fn() };
    
    registry.register('p1', p1);
    registry.register('p2', p2, true);
    
    expect(registry.getProvider()).toBe(p2);
  });

  it('should throw if provider not found', () => {
    const registry = new AIProviderRegistry();
    expect(() => registry.getProvider('ghost')).toThrow();
  });
});

describe('FallbackAIProvider', () => {
  it('should use primary provider if it succeeds', async () => {
    const primary: AIProvider = { analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 1 }) };
    const secondary: AIProvider = { analyzeCode: vi.fn() };
    const fallback = new FallbackAIProvider(primary, secondary);
    
    const result = await fallback.analyzeCode({ code: '', filePath: '' });
    
    expect(result.confidenceScore).toBe(1);
    expect(primary.analyzeCode).toHaveBeenCalled();
    expect(secondary.analyzeCode).not.toHaveBeenCalled();
  });

  it('should use secondary provider if primary fails', async () => {
    const primary: AIProvider = { analyzeCode: vi.fn().mockRejectedValue(new Error('API Down')) };
    const secondary: AIProvider = { analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 0.5 }) };
    const onFallback = vi.fn();
    const fallback = new FallbackAIProvider(primary, secondary, onFallback);
    
    const result = await fallback.analyzeCode({ code: '', filePath: '' });
    
    expect(result.confidenceScore).toBe(0.5);
    expect(primary.analyzeCode).toHaveBeenCalled();
    expect(secondary.analyzeCode).toHaveBeenCalled();
    expect(onFallback).toHaveBeenCalled();
  });
});
