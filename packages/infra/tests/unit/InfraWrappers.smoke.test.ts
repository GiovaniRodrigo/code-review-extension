import { describe, it, expect, vi } from 'vitest';
import { FileAuditLogService } from '../../src/FileAuditLogService';
import { MockAIProvider } from '../../src/MockAIProvider';
import { MockEmbeddingProvider } from '../../src/MockEmbeddingProvider';
import * as fs from 'fs';

describe('Infra Wrappers Smoke Tests', () => {
  it('FileAuditLogService should be instantiable', () => {
    const service = new FileAuditLogService('/tmp/audit.log');
    expect(service).toBeDefined();
  });

  it('MockAIProvider should analyze code', async () => {
    const provider = new MockAIProvider();
    const result = await provider.analyzeCode({ code: '', filePath: '' });
    expect(result.findings).toHaveLength(2);
  });

  it('MockEmbeddingProvider should generate embedding', async () => {
    const provider = new MockEmbeddingProvider();
    const result = await provider.generateEmbedding('test');
    expect(result.length).toBeGreaterThan(0);
  });
});
