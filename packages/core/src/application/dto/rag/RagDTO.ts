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
