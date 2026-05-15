import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';
import { AstBuilderPort, AstNodeSummary } from '@code-review/core';
import * as fs from 'fs';

export class SecurityAnalyzer implements AnalyzerPort {
  constructor(private readonly astBuilder: AstBuilderPort) {}

  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    const findings: AnalyzerFinding[] = [];

    for (const filePath of paths) {
      if (!fs.existsSync(filePath)) continue;
      
      const code = fs.readFileSync(filePath, 'utf8');
      const ast = await this.astBuilder.build({ filePath, code });

      this._checkSecurity(ast.root, filePath, findings);
    }

    return findings;
  }

  private _checkSecurity(node: AstNodeSummary, filePath: string, findings: AnalyzerFinding[]) {
    const secretRegex = /api[-_]?key|password|secret|token|private[-_]?key/i;

    if (node.kind === 'literal') {
      const text = node.name;
      if (secretRegex.test(text) && text.length > 5) {
        findings.push({
          file: filePath,
          rule: 'security.hardcoded-secret',
          message: `Possible hardcoded secret detected: "${text.substring(0, 3)}..."`,
          severity: 'critical'
        });
      }
    }

    node.children.forEach(child => this._checkSecurity(child, filePath, findings));
  }
}
