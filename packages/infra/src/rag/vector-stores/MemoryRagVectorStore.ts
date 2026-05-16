import type { RagChunkDTO } from '../../../../core/src/application/dto/rag/RagDTO';
import type { RagVectorStorePort } from '../../../../core/src/ports/rag/RagVectorStorePort';

export class MemoryRagVectorStore implements RagVectorStorePort {
  private readonly items: { chunk: RagChunkDTO, vector: number[] }[] = [];

  async add(chunk: RagChunkDTO, vector: number[]): Promise<void> {
    this.items.push({ chunk, vector });
  }

  async search(vector: number[], limit: number, query?: string): Promise<RagChunkDTO[]> {
    return this.items
      .map(item => {
        const vectorScore = this._calculateScore(item.vector, vector);
        const keywordScore = query ? this._calculateKeywordScore(item.chunk.content, query) : 0;
        
        // Hybrid score: 70% vector, 30% keyword
        const finalScore = query ? (vectorScore * 0.7 + keywordScore * 0.3) : vectorScore;

        return {
          ...item,
          score: finalScore
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(i => i.chunk);
  }

  private _calculateKeywordScore(content: string, query: string): number {
    const contentWords = new Set(content.toLowerCase().split(/\W+/));
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    
    if (queryWords.length === 0) return 0;
    
    let matches = 0;
    queryWords.forEach(word => {
      if (contentWords.has(word)) matches++;
    });

    return matches / queryWords.length;
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
