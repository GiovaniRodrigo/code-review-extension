
export interface StructuredFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category:
    | 'architecture'
    | 'performance'
    | 'security'
    | 'clean_code'
    | 'testing'
    | 'dependency'
    | 'scalability'
    | 'maintainability';

  status: 'open' | 'resolved';
  decision: 'approved' | 'changes_requested' | 'rejected';

  file: string;
  line: number;

  title: string;
  description: string;
  suggestion: string;

  confidence: number;
}
