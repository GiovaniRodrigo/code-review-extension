export interface DashboardHeatItem {
  file: string;
  score: number;
}

export interface DashboardLogEntry {
  action: string;
  timestamp: Date | string;
  metadata?: {
    file?: string;
    message?: string;
  };
}

export interface DashboardState {
  coverage: number;
  mutationScore: number;
  testability: {
    score: number;
    level: string;
  };
  gatesPassed: boolean;
  buildStatus: string;
  heat: DashboardHeatItem[];
  logs: DashboardLogEntry[];
  activeAIProvider?: string;
  providerStatus?: string;
  ragStatus?: string;
  plan?: string;
  targetAudience?: string;
  qualityScore?: number;
  reviewStatus?: string;
  workspaceName?: string;
  reviewTemplate?: string;
  proStatus?: {
    cloudProviderConfigured: boolean;
    pdfExportAvailable: boolean;
    qualityReportAvailable: boolean;
    prSummaryAvailable: boolean;
  };
  sessionSummary?: {
    branch: string;
    findings: number;
    approved: number;
    pending: number;
    updatedAt?: string;
  };
}


