export interface RagStatusState {
  status: 'idle' | 'indexing' | 'error';
  totalChunks?: number;
  lastIndexed?: string;
  error?: string;
}
