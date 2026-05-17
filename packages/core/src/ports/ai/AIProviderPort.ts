import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../application/dto/ai/AIAnalysisDTO';
import {
  AIChatRequestDTO,
  AIChatResponseDTO
} from '../../application/dto/ai/AIChatDTO';

export type AIProviderType = 'mock' | 'ollama' | 'openai' | 'gemini' | 'cloud' | 'claude';

export interface AIProviderConfig {
  id: string;
  type: AIProviderType;
  label: string;
  baseUrl?: string;
  apiKey?: string | (() => Promise<string>);
  model: string;
  enabled: boolean;
}

export type AIProviderStatus = 'available' | 'unavailable' | 'unauthorized' | 'timeout' | 'model_not_found';

export interface HealthStatusDTO {
  status: AIProviderStatus;
  message?: string;
}

export interface AIProviderSettings {
  activeProviderId?: string;
  providers: AIProviderConfig[];
}

export interface AIProviderPort {
  analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO>;
  chat(input: AIChatRequestDTO): Promise<AIChatResponseDTO>;
  checkHealth(): Promise<HealthStatusDTO>;
}
