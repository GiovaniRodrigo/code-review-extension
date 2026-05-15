export type AIExecutionMode = 'fast' | 'standard' | 'deep' | 'audit';

export interface AIAnalysisRequestDTO {
  code: string;
  filePath: string;
  language?: string;
  context?: string;
  mode?: AIExecutionMode;
  signal?: AbortSignal;
}

export interface AIAnalysisFindingDTO {
  file: string;
  line: number;
  column?: number;
  severity: 'info' | 'warning' | 'critical';
  category:
    | 'architecture'
    | 'solid'
    | 'security'
    | 'code_smell'
    | 'test'
    | 'dependency'
    | 'rag';
  message: string;
  suggestedFix?: string;
  confidence: number;
}

export interface AIAnalysisResponseDTO {
  findings: AIAnalysisFindingDTO[];
  confidenceScore: number;
}
