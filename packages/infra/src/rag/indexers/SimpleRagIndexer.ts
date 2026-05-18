import type { RagIndexerPort } from '../../../../core/src/ports/rag/RagIndexerPort';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';
import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';
import { SemanticChunkerService } from '../../../../core/src/application/rag/SemanticChunkerService';
import { AstBuilderPort } from '../../../../core/src/ports/ast/AstBuilderPort';
import { RagStatusDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import * as fs from 'fs';
import * as path from 'path';

export interface RagIndexerConfig {
    storageDir?: string;
    ignoredFolders?: string[];
}

export class SimpleRagIndexer implements RagIndexerPort {
  private readonly manifestPath: string;
  private manifest: { files: Record<string, { mtime: number, size: number }>, lastIndexed?: string } = { files: {} };
  private status: 'idle' | 'indexing' | 'error' = 'idle';
  private lastError?: string;

  constructor(
    private readonly vectorStore: RagVectorStorePort,
    private readonly embeddingProvider: RagEmbeddingProviderPort,
    private readonly astBuilder: AstBuilderPort,
    private readonly config: RagIndexerConfig = {}
  ) {
    this.manifestPath = config.storageDir ? path.join(config.storageDir, 'rag-manifest.json') : '';
    this._loadManifest();
  }

  async indexRepository(rootPath: string): Promise<void> {
    this.status = 'indexing';
    this.lastError = undefined;
    
    try {
      const startTime = Date.now();
      const chunker = new SemanticChunkerService(this.astBuilder);
      const files = this._getFiles(rootPath);
      let updatedCount = 0;
      let totalChunks = 0;

      for (const file of files) {
        try {
          const stat = fs.statSync(file);
          
          if (stat.size > 1024 * 1024) {
            console.warn(`[RAG] Skipping large file: ${file} (${stat.size} bytes)`);
            continue;
          }

          const lastIndexed = this.manifest.files[file];

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

          this.manifest.files[file] = { mtime: stat.mtimeMs, size: stat.size };
          updatedCount++;
        } catch (e: any) {
          console.error(`[RAG] Failed to index ${file}: ${e.message}`);
        }
      }

      this.manifest.lastIndexed = new Date().toISOString();
      this._saveManifest();

      const duration = Date.now() - startTime;
      console.log(`[RAG] Indexing completed in ${duration}ms. Files updated: ${updatedCount}. Total chunks: ${totalChunks}`);
      this.status = 'idle';
    } catch (e: any) {
      this.status = 'error';
      this.lastError = e.message;
      throw e;
    }
  }

  async clear(): Promise<void> {
    await this.vectorStore.clear();
    this.manifest = { files: {} };
    this._saveManifest();
  }

  async getStatus(): Promise<RagStatusDTO> {
    const totalChunks = await this.vectorStore.count();
    const totalFiles = Object.keys(this.manifest.files).length;
    
    return {
      status: this.status,
      totalChunks,
      totalFiles,
      lastIndexed: this.manifest.lastIndexed,
      lastError: this.lastError
    };
  }

  private _loadManifest() {
    if (!this.manifestPath || !fs.existsSync(this.manifestPath)) return;
    try {
        const data = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
        if (data.files) {
            this.manifest = data;
        } else {
            this.manifest = { files: data };
        }
    } catch (e) {
        this.manifest = { files: {} };
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

    const ignored = new Set(this.config.ignoredFolders ?? [
      'node_modules', '.git', 'dist', '.turbo', 'coverage', 'out', 'build',
      '.vscode-test', '.next', '.nuxt', '.output', 'vendor', 'storage'
    ]);

    let list: string[] = [];
    try {
      list = fs.readdirSync(dir);
    } catch (e: any) {
      console.warn(`[RAG] Skipping unreadable directory: ${dir} (${e?.message ?? e})`);
      return results;
    }

    for (const file of list) {
      const fullPath = path.join(dir, file);
      let stat: fs.Stats;

      try {
        stat = fs.statSync(fullPath);
      } catch (e: any) {
        console.warn(`[RAG] Skipping missing or broken path: ${fullPath} (${e?.message ?? e})`);
        continue;
      }

      if (stat.isDirectory()) {
        if (!ignored.has(file)) {
          results.push(...this._getFiles(fullPath));
        }
        continue;
      }

      if (!stat.isFile()) continue;
      if (this._shouldIndexFile(file, fullPath)) {
        results.push(fullPath);
      }
    }

    return results;
  }

  private _shouldIndexFile(file: string, fullPath: string): boolean {
    const normalized = fullPath.replace(/\\/g, '/');
    const ext = path.extname(file).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.php', '.vue', '.md'].includes(ext)) return false;
    if (normalized.endsWith('.d.ts') || normalized.endsWith('.map') || normalized.endsWith('.min.js')) return false;
    if (/\/(fixtures|fixture|__fixtures__|examples?|mocks?|__mocks__)\//i.test(`/${normalized}/`)) return false;
    if (/\b(package-lock|pnpm-lock|yarn\.lock)\b/i.test(normalized)) return false;
    return true;
  }
}
