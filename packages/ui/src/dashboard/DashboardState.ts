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
  providerStatus?: string;
  ragStatus?: string;
}
