import { AstParser } from './ports/ast/AstParser';
import { TypeScriptAstParser } from './ast/TypeScriptAstParser';
import { PythonAstParser } from './ast/PythonAstParser';
import { GoAstParser } from './ast/GoAstParser';
import { AstNodeKind, AstNodeSummary, AstMetrics } from './shared/astTypes';

export { AstNodeKind, AstNodeSummary, AstMetrics };

export interface AstBuildInput {
  filePath: string;
  code: string;
  language?: string;
}

export interface AstBuildResult {
  filePath: string;
  language: string;
  code: string;
  root: AstNodeSummary;
  metrics: AstMetrics;
}

export class AstBuilder {
  private parsers: AstParser[] = [
      new TypeScriptAstParser(),
      new PythonAstParser(),
      new GoAstParser()
  ];

  async build(input: AstBuildInput): Promise<AstBuildResult> {
    const language = input.language || this._detectLanguage(input.filePath);
    const parser = this.parsers.find(p => p.supports(language));

    if (!parser) {
        // Basic fallback for unsupported languages
        return {
            filePath: input.filePath,
            language,
            code: input.code,
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
      code: input.code,
      root,
      metrics
    };
  }

  private _detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (['ts', 'tsx'].includes(ext || '')) return 'typescript';
    if (['js', 'jsx'].includes(ext || '')) return 'javascript';
    if (['py'].includes(ext || '')) return 'python';
    if (['go'].includes(ext || '')) return 'go';
    return 'text';
  }
}
