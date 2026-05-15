import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';

export class MemoryRagVectorStore implements RagVectorStorePort {
  private readonly items: { chunk: RagChunkDTO, vector: number[] }[] = [];

  async add(chunk: RagChunkDTO, vector: number[]): Promise<void> {
    this.items.push({ chunk, vector });
  }

  async search(vector: number[], limit: number): Promise<RagChunkDTO[]> {
    // Phase 8: Hardening - Implement simple word overlap score if vector length matches but is low-info
    // For now, since we use SimpleEmbeddingProvider (dummy), we'll do a simple text-based scoring 
    // to improve results without a real local LLM embedding engine yet.
    
    return this.items
      .map(item => ({
        ...item,
        score: this._calculateScore(item.vector, vector)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(i => i.chunk);
  }

  private _calculateScore(v1: number[], v2: number[]): number {
    // Cosine similarity if vectors are meaningful
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < v1.length; i++) {
        dotProduct += v1[i] * v2[i];
        normA += v1[i] * v1[i];
        normB += v2[i] * v2[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  async deleteBySource(source: string): Promise<void> {
    const indicesToDelete: number[] = [];
    this.items.forEach((item, index) => {
        if (item.chunk.source === source) {
            indicesToDelete.push(index);
        }
    });

    for (let i = indicesToDelete.length - 1; i >= 0; i--) {
        this.items.splice(indicesToDelete[i], 1);
    }
  }

  async clear(): Promise<void> {
    this.items.length = 0;
  }
}
