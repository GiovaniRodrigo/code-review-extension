export interface ReviewFinding {
  id: string;
  file: string;
  line: number;
  message: string;
  severity: string;
  status: string;
  confidenceScore?: number;
  discussion?: Array<{
    author: string;
    body: string;
  }>;
}

export interface ReviewPanelState {
  sessionId: string;
  branch: string;
  findings: ReviewFinding[];
  loading?: boolean;
  filter?: string;
  collapsed?: string[];
}
