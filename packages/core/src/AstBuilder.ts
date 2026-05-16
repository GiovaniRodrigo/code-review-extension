import { AstParser } from './ports/ast/AstParser';
import { TypeScriptAstParser } from './ast/TypeScriptAstParser';
import { PythonAstParser } from './ast/PythonAstParser';

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

export class AstBuilder {
  private parsers: AstParser[] = [
      new TypeScriptAstParser(),
      new PythonAstParser()
  ];

  async build(input: AstBuildInput): Promise<AstBuildResult> {
    const language = input.language || this._detectLanguage(input.filePath);
    const parser = this.parsers.find(p => p.supports(language));

    if (!parser) {
        // Basic fallback for unsupported languages
        return {
            filePath: input.filePath,
            language,
            root: {
                kind: 'sourceFile',
                name: input.filePath,
                startLine: 1,
                endLine: input.code.split('\n').length,
                children: []
            },
            metrics: {
                imports: 0, exports: 0, classes: 0, interfaces: 0,
                functions: 0, methods: 0, properties: 0, variables: 0,
                maxDepth: 1
            }
        };
    }

    const { root, metrics } = await parser.parse(input.filePath, input.code);

    return {
      filePath: input.filePath,
      language,
      root,
      metrics
    };
  }

  private _detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (['ts', 'tsx'].includes(ext || '')) return 'typescript';
    if (['js', 'jsx'].includes(ext || '')) return 'javascript';
    if (['py'].includes(ext || '')) return 'python';
    return 'text';
  }
}
