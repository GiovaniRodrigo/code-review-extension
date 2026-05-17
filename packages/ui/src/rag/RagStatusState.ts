export interface RagStatusState {
  status: 'idle' | 'indexing' | 'error' | 'disabled';
  totalChunks?: number;
  totalFiles?: number;
  lastIndexed?: string;
  embeddingProvider?: string;
  error?: string;
}
