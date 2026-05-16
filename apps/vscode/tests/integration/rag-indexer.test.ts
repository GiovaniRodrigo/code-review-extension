import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimpleRagIndexer } from '@code-review/infra';
import * as fs from 'fs';
import * as path from 'path';

describe('RAG Indexer Tests', () => {
  let mockVectorStore: any;
  let mockEmbeddingProvider: any;
  let mockAstBuilder: any;
  let indexer: SimpleRagIndexer;
  const testWorkspace = path.join(__dirname, 'rag-test-workspace');

  beforeEach(async () => {
    vi.clearAllMocks();
    
    mockVectorStore = {
      add: vi.fn(async () => {}),
      deleteBySource: vi.fn(async () => {}),
      clear: vi.fn(async () => {})
    };

    mockEmbeddingProvider = {
      generateEmbedding: vi.fn(async () => [0.1, 0.2, 0.3])
    };

    mockAstBuilder = {
      build: vi.fn(() => ({ 
          root: { 
              children: [
                  { kind: 'function', startLine: 1, endLine: 1 }
              ] 
          },
          language: 'typescript'
      }))
    };

    indexer = new SimpleRagIndexer(
      mockVectorStore,
      mockEmbeddingProvider,
      mockAstBuilder,
      { ignoredFolders: ['ignored'] }
    );

    if (fs.existsSync(testWorkspace)) {
        fs.rmSync(testWorkspace, { recursive: true, force: true });
    }
    fs.mkdirSync(testWorkspace, { recursive: true });
  });

  it('should index files in a directory', async () => {
    const filePath = path.join(testWorkspace, 'test.ts');
    fs.writeFileSync(filePath, 'console.log("hello");');

    await indexer.indexRepository(testWorkspace);

    expect(mockVectorStore.add).toHaveBeenCalled();
    expect(mockEmbeddingProvider.generateEmbedding).toHaveBeenCalled();
  });

  it('should ignore specified folders', async () => {
    const ignoredDir = path.join(testWorkspace, 'ignored');
    fs.mkdirSync(ignoredDir);
    fs.writeFileSync(path.join(ignoredDir, 'secret.ts'), 'console.log("hidden");');

    await indexer.indexRepository(testWorkspace);

    // Should not have called add for files in the ignored folder
    const calls = mockVectorStore.add.mock.calls;
    const hasIgnored = calls.some((call: any) => call[0].source.includes('ignored'));
    expect(hasIgnored).toBe(false);
  });

  it('should clear the index', async () => {
    await indexer.clear();
    expect(mockVectorStore.clear).toHaveBeenCalled();
  });
});
