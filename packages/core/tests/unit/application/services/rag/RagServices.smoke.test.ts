import { describe, it, expect, vi } from 'vitest';
import { RagContextService } from '../../../../../src/application/services/rag/RagContextService';
import { RagIndexingService } from '../../../../../src/application/services/rag/RagIndexingService';
import { RagOrchestratorService } from '../../../../../src/application/services/rag/RagOrchestratorService';

describe('Rag Services Smoke Tests', () => {
  it('should instantiate RagContextService', () => {
    expect(new RagContextService({} as any)).toBeDefined();
  });

  it('should instantiate RagIndexingService', () => {
    expect(new RagIndexingService({} as any, {} as any)).toBeDefined();
  });

  it('should instantiate RagOrchestratorService', () => {
    expect(new RagOrchestratorService({} as any, {} as any)).toBeDefined();
  });
});
