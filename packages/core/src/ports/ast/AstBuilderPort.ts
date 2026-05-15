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
  | 'literal'
  | 'unknown';

export interface AstNodeSummary {
  kind: AstNodeKind;
  name: string;
  startLine: number;
  endLine: number;
  children: AstNodeSummary[];
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

export interface AstBuildInput {
  filePath: string;
  code: string;
  language?: string;
}

export interface AstBuildResult {
  filePath: string;
  language: string;
  root: AstNodeSummary;
  metrics: AstMetrics;
}

export interface AstBuilderPort {
  build(input: AstBuildInput): Promise<AstBuildResult>;
}
