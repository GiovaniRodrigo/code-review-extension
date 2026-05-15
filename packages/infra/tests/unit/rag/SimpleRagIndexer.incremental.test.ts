import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimpleRagIndexer } from '../../../src/rag/indexers/SimpleRagIndexer';
import { MemoryRagVectorStore } from '../../../src/rag/vector-stores/MemoryRagVectorStore';
import { TypeScriptAstBuilder } from '../../../src/ast/TypeScriptAstBuilder';
import { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';
import * as fs from 'node:fs';
import * as path from 'node:path';

vi.mock('node:fs');

describe('SimpleRagIndexer Incremental', () => {
  let indexer: SimpleRagIndexer;
  let vectorStore: MemoryRagVectorStore;
  let mockEmbedding: RagEmbeddingProviderPort;
  const tempDir = '/tmp/rag-test';

  beforeEach(() => {
    vectorStore = new MemoryRagVectorStore();
    mockEmbedding = { generateEmbedding: vi.fn().mockResolvedValue(Array(1536).fill(0)) };
    indexer = new SimpleRagIndexer(vectorStore, mockEmbedding, new TypeScriptAstBuilder(), tempDir);
    
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue('export class X {}');
    vi.mocked(fs.readdirSync).mockReturnValue(['a.ts'] as any);
  });

  it('deve pular arquivos que não foram modificados', async () => {
    const filePath = path.join('/project', 'a.ts');
    vi.mocked(fs.statSync).mockReturnValue({ mtimeMs: 1000, size: 100, isDirectory: () => false } as any);
    vi.mocked(fs.readdirSync).mockReturnValue(['a.ts'] as any);

    // 1. Primeira indexação
    await indexer.indexRepository('/project');
    expect(mockEmbedding.generateEmbedding).toHaveBeenCalledTimes(1);

    // 2. Segunda indexação (mesmo mtime)
    await indexer.indexRepository('/project');
    expect(mockEmbedding.generateEmbedding).toHaveBeenCalledTimes(1); // Não chamou de novo
  });

  it('deve re-indexar arquivos modificados', async () => {
    const filePath = path.join('/project', 'a.ts');
    vi.mocked(fs.statSync).mockReturnValue({ mtimeMs: 1000, size: 100, isDirectory: () => false } as any);

    // 1. Primeira indexação
    await indexer.indexRepository('/project');

    // 2. Modificar mtime e re-indexar
    vi.mocked(fs.statSync).mockReturnValue({ mtimeMs: 2000, size: 105, isDirectory: () => false } as any);
    await indexer.indexRepository('/project');
    
    expect(mockEmbedding.generateEmbedding).toHaveBeenCalledTimes(2);
  });
});
