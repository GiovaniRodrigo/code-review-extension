import type { RagIndexerPort } from '../../../../core/src/ports/rag/RagIndexerPort';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';
import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';
import { SemanticChunkerService } from '../../../../core/src/application/rag/SemanticChunkerService';
import { AstBuilderPort } from '../../../../core/src/ports/ast/AstBuilderPort';
import * as fs from 'fs';
import * as path from 'path';

export class SimpleRagIndexer implements RagIndexerPort {
  private readonly manifestPath: string;
  private manifest: Record<string, { mtime: number, size: number }> = {};

  constructor(
    private readonly vectorStore: RagVectorStorePort,
    private readonly embeddingProvider: RagEmbeddingProviderPort,
    private readonly astBuilder: AstBuilderPort,
    storageDir?: string
  ) {
    this.manifestPath = storageDir ? path.join(storageDir, 'rag-manifest.json') : '';
    this._loadManifest();
  }

  async indexRepository(rootPath: string): Promise<void> {
    const startTime = Date.now();
    const chunker = new SemanticChunkerService(this.astBuilder);
    const files = this._getFiles(rootPath);
    let updatedCount = 0;
    let totalChunks = 0;

    for (const file of files) {
      const stat = fs.statSync(file);
      const lastIndexed = this.manifest[file];

      if (lastIndexed && lastIndexed.mtime === stat.mtimeMs && lastIndexed.size === stat.size) {
        continue; 
      }

      console.log(`[RAG] Indexing ${file}...`);
      const code = fs.readFileSync(file, 'utf8');
      
      if (lastIndexed) {
          await this.vectorStore.deleteBySource(file);
      }

      const chunks = await chunker.chunk(file, code);
      totalChunks += chunks.length;
      for (const chunk of chunks) {
        const vector = await this.embeddingProvider.generateEmbedding(chunk.content);
        await this.vectorStore.add({
          id: chunk.id,
          content: chunk.content,
          source: chunk.file,
          metadata: {
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            language: chunk.language
          }
        }, vector);
      }

      this.manifest[file] = { mtime: stat.mtimeMs, size: stat.size };
      updatedCount++;
    }

    if (updatedCount > 0) {
        this._saveManifest();
    }

    const duration = Date.now() - startTime;
    console.log(`[RAG] Indexing completed in ${duration}ms. Files updated: ${updatedCount}. Total chunks: ${totalChunks}`);
  }

  async clear(): Promise<void> {
    await this.vectorStore.clear();
    this.manifest = {};
    this._saveManifest();
  }

  private _loadManifest() {
    if (!this.manifestPath || !fs.existsSync(this.manifestPath)) return;
    try {
        this.manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    } catch (e) {
        this.manifest = {};
    }
  }

  private _saveManifest() {
    if (!this.manifestPath) return;
    try {
        fs.writeFileSync(this.manifestPath, JSON.stringify(this.manifest, null, 2));
    } catch (e) {
        console.error('[RAG] Failed to save manifest', e);
    }
  }

  private _getFiles(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat && stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.turbo') {
          results.push(...this._getFiles(fullPath));
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        results.push(fullPath);
      }
    }
    return results;
  }
}
