import type { RagIndexerPort } from '../../../../core/src/ports/rag/RagIndexerPort';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';
import type { RagEmbeddingProviderPort } from '../../../../core/src/ports/rag/RagEmbeddingProviderPort';
import { SemanticChunkerService } from '../../../../core/src/application/rag/SemanticChunkerService';
import { AstBuilderPort } from '../../../../core/src/ports/ast/AstBuilderPort';
import * as fs from 'fs';
import * as path from 'path';

export class SimpleRagIndexer implements RagIndexerPort {
  constructor(
    private readonly vectorStore: RagVectorStorePort,
    private readonly embeddingProvider: RagEmbeddingProviderPort,
    private readonly astBuilder: AstBuilderPort
  ) {}

  async indexRepository(rootPath: string): Promise<void> {
    const chunker = new SemanticChunkerService(this.astBuilder);
    const files = this._getFiles(rootPath);

    for (const file of files) {
      const code = fs.readFileSync(file, 'utf8');
      const chunks = await chunker.chunk(file, code);
      
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
    }
  }

  async clear(): Promise<void> {
    await this.vectorStore.clear();
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
