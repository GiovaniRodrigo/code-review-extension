export type AstNodeKind =
  | 'sourceFile'
  | 'import'
  | 'export'
  | 'class'
  | 'interface'
  | 'function'
  | 'method'
  | 'property'
  | 'variable'
  | 'unknown';

export interface AstNodeSummary {
  kind: AstNodeKind;
  name: string;
  startLine: number;
  endLine: number;
  children: AstNodeSummary[];
  metadata?: Record<string, any>;
}

export interface AstMetrics {
  imports: number;
  exports: number;
  classes: number;
  interfaces: number;
  functions: number;
  methods: number;
  properties: number;
  variables: number;
  maxDepth: number;
}
