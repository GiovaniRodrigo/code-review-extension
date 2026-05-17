export interface AIChatMessageDTO {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequestDTO {
  messages: AIChatMessageDTO[];
  context?: string;
  model?: string;
  signal?: AbortSignal;
}

export interface AIChatResponseDTO {
  answer: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
