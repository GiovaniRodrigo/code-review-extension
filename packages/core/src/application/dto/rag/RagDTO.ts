export interface RagChunkDTO {
  id: string;
  content: string;
  source: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface RagSearchRequestDTO {
  query: string;
  limit?: number;
}

export interface RagSearchResponseDTO {
  chunks: RagChunkDTO[];
}

export interface RagStatusDTO {
  status: 'idle' | 'indexing' | 'error' | 'disabled';
  totalChunks: number;
  totalFiles: number;
  lastIndexed?: string;
  embeddingProvider?: string;
  lastError?: string;
}
