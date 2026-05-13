export interface AnalyzerFinding {
  file: string;
  rule: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}
