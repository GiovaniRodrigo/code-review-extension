import { Finding, ReviewSession } from '@code-review/domain';

export interface IDEAdapter {
  getActiveFileContent(): Promise<string>;
  getActiveFilePath(): Promise<string>;
  getActiveBranch(): Promise<string>;
  showFinding(finding: Finding): Promise<void>;
  focusFinding(finding: Finding): Promise<void>;
  applyFix(finding: Finding): Promise<void>;
  showNotification(message: string, type: 'info' | 'warning' | 'error'): Promise<void>;
}

export interface AIAnalysisInput {
  code: string;
  language?: string;
  filePath: string;
  context?: string;
}

export interface AIAnalysisResult {
  findings: Partial<Finding>[];
  confidenceScore: number;
}

export interface AIProvider {
  analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}

export interface ReviewRepository {
  saveSession(session: ReviewSession): Promise<void>;
  getSessionByBranch(branch: string): Promise<ReviewSession | null>;
  getSessionById(id: string): Promise<ReviewSession | null>;
  deleteSession(id: string): Promise<void>;
}

export * from './InMemoryReviewRepository';
export * from './FileReviewRepository';
export * from './MockAIProvider';
export * from './OpenAIProvider';
export * from './OllamaProvider';
