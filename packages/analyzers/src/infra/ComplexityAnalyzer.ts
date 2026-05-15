import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';
import { AstBuilderPort, AstNodeSummary } from '@code-review/core';
import * as fs from 'fs';

export class ComplexityAnalyzer implements AnalyzerPort {
  constructor(private readonly astBuilder: AstBuilderPort) {}

  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    const findings: AnalyzerFinding[] = [];

    for (const filePath of paths) {
      if (!fs.existsSync(filePath)) continue;
      
      const code = fs.readFileSync(filePath, 'utf8');
      const ast = await this.astBuilder.build({ filePath, code });

      this._checkComplexity(ast.root, filePath, findings);
    }

    return findings;
  }

  private _checkComplexity(node: AstNodeSummary, filePath: string, findings: AnalyzerFinding[]) {
    if (node.kind === 'method') {
      const lineCount = node.endLine - node.startLine;
      if (lineCount > 30) {
        findings.push({
          file: filePath,
          rule: 'complexity.long-method',
          message: `Method ${node.name} is too long (${lineCount} lines).`,
          severity: 'warning'
        });
      }
    }

    node.children.forEach(child => this._checkComplexity(child, filePath, findings));
  }
}
