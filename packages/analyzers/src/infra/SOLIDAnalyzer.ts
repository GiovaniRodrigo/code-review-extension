import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';
import { AstBuilderPort, AstNodeSummary } from '@code-review/core';
import * as fs from 'fs';

export class SOLIDAnalyzer implements AnalyzerPort {
  constructor(private readonly astBuilder: AstBuilderPort) {}

  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    const findings: AnalyzerFinding[] = [];

    for (const filePath of paths) {
      if (!fs.existsSync(filePath)) continue;
      
      const code = fs.readFileSync(filePath, 'utf8');
      const ast = await this.astBuilder.build({ filePath, code });

      this._checkSRP(ast.root, filePath, findings);
    }

    return findings;
  }

  private _checkSRP(node: AstNodeSummary, filePath: string, findings: AnalyzerFinding[]) {
    if (node.kind === 'class') {
      const methods = node.children.filter(c => c.kind === 'method');
      if (methods.length > 10) {
        findings.push({
          file: filePath,
          rule: 'solid.srp',
          message: `Class ${node.name} has too many methods (${methods.length}). Possible SRP violation.`,
          severity: 'warning'
        });
      }
    }

    node.children.forEach(child => this._checkSRP(child, filePath, findings));
  }
}
