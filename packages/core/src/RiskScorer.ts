import { AstBuildResult } from './AstBuilder';
import { StaticRuleFinding } from './StaticRuleEngine';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskScore {
  score: number;
  level: RiskLevel;
  reasons: string[];
}

export class RiskScorer {
  score(ast: AstBuildResult, findings: StaticRuleFinding[] = []): RiskScore {
    const reasons: string[] = [];
    let score = 0;

    score += findings.length * 10;
    if (findings.length > 0) {
      reasons.push(`${findings.length} static rule finding(s)`);
    }

    const errorCount = findings.filter(finding => finding.severity === 'error').length;
    const warningCount = findings.filter(finding => finding.severity === 'warning').length;
    score += errorCount * 20;
    score += warningCount * 8;

    if (errorCount > 0) {
      reasons.push(`${errorCount} error-level finding(s)`);
    }

    if (warningCount > 0) {
      reasons.push(`${warningCount} warning-level finding(s)`);
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

    const normalized = Math.min(score, 100);

    return {
      score: normalized,
      level: this._levelFor(normalized),
      reasons
    };
  }

  private _levelFor(score: number): RiskLevel {
    if (score >= 70) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }
}
