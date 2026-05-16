import { AstBuildResult } from './AstBuilder';
import { StaticRuleFinding } from './StaticRuleEngine';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskScore {
  score: number;
  level: RiskLevel;
  reasons: string[];
}

export interface MethodRiskScore extends RiskScore {
  name: string;
  line: number;
}

export interface FileRiskScore extends RiskScore {
  methods: MethodRiskScore[];
}

export class RiskScorer {
  score(ast: AstBuildResult, findings: StaticRuleFinding[] = []): FileRiskScore {
    const reasons: string[] = [];
    let score = 0;

    // Overall findings weight
    score += findings.length * 10;
    if (findings.length > 0) {
      reasons.push(`${findings.length} total static rule finding(s)`);
    }

    const errorCount = findings.filter(finding => finding.severity === 'error').length;
    const warningCount = findings.filter(finding => finding.severity === 'warning').length;
    score += errorCount * 20;
    score += warningCount * 8;

    if (errorCount > 0) {
      reasons.push(`${errorCount} total error-level finding(s)`);
    }

    if (warningCount > 0) {
      reasons.push(`${warningCount} total warning-level finding(s)`);
    }

    if (ast.metrics.classes > 5) {
      score += 12;
      reasons.push('many classes in one file');
    }

    if (ast.metrics.functions > 10) {
      score += 12;
      reasons.push('many top-level functions in one file');
    }

    if (ast.metrics.maxDepth > 3) {
      score += 8;
      reasons.push('deep structural nesting');
    }

    // Method-level scores
    const methodScores: MethodRiskScore[] = [];
    this._collectMethodScores(ast.root, findings, methodScores);

    const normalized = Math.min(score, 100);

    return {
      score: normalized,
      level: this._levelFor(normalized),
      reasons,
      methods: methodScores
    };
  }

  private _collectMethodScores(node: any, findings: StaticRuleFinding[], scores: MethodRiskScore[]) {
    if (node.kind === 'method' || node.kind === 'function') {
      const methodFindings = findings.filter(f => f.line >= node.startLine && f.line <= node.endLine);
      let methodScore = 0;
      const methodReasons: string[] = [];

      methodScore += methodFindings.length * 15;
      if (methodFindings.length > 0) {
        methodReasons.push(`${methodFindings.length} finding(s) inside this ${node.kind}`);
      }

      const errors = methodFindings.filter(f => f.severity === 'error').length;
      methodScore += errors * 25;
      if (errors > 0) methodReasons.push(`${errors} error(s)`);

      const lineCount = node.endLine - node.startLine + 1;
      if (lineCount > 30) {
        methodScore += 15;
        methodReasons.push(`long ${node.kind} (${lineCount} lines)`);
      }

      const cognitive = node.metadata?.cognitive || 0;
      if (cognitive > 10) {
          methodScore += cognitive * 2;
          methodReasons.push(`high cognitive complexity (${cognitive})`);
      }

      const normalized = Math.min(methodScore, 100);
      scores.push({
        name: node.name,
        line: node.startLine,
        score: normalized,
        level: this._levelFor(normalized),
        reasons: methodReasons
      });
    }

    if (node.children) {
      node.children.forEach((child: any) => this._collectMethodScores(child, findings, scores));
    }
  }

  private _levelFor(score: number): RiskLevel {
    if (score >= 70) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }
}
