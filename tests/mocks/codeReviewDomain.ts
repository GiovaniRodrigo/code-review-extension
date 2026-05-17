export interface Finding {
  id: string;
  file: string;
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  status?: 'pending' | 'approved' | 'rejected';
  suggestedFix?: string;
}
