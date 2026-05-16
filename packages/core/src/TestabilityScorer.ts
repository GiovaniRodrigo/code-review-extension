import { AstBuildResult, AstNodeSummary } from './AstBuilder';
import { flattenAstNodes } from './shared/astUtils';

export interface TestabilityScore {
  score: number; // 0-100
  level: 'easy' | 'moderate' | 'hard';
  reasons: string[];
}

export class TestabilityScorer {
  calculate(ast: AstBuildResult): TestabilityScore {
    let score = 100;
    const reasons: string[] = [];
    const allNodes = flattenAstNodes(ast.root);

    // 1. Dependency Injection Check
    const classes = allNodes.filter(n => n.kind === 'class');
    classes.forEach(cls => {
        const constructor = cls.children.find(c => c.name === 'constructor');
        if (constructor) {
            const params = constructor.metadata?.parameters || 0;
            if (params === 0 && cls.children.some(c => c.kind === 'property' && c.name.toLowerCase().includes('service'))) {
                score -= 15;
                reasons.push(`Class ${cls.name} might be using hardcoded dependencies instead of DI.`);
            }
        }
    });

    // 2. Interface Usage (Abstractions)
    if (ast.language === 'typescript' && ast.metrics.interfaces === 0 && ast.metrics.classes > 0) {
        score -= 10;
        reasons.push('No interfaces found. Coding to concrete classes makes mocking harder.');
    }

    // 3. Method Length & Complexity
    const complexMethods = allNodes.filter(n => 
        (n.kind === 'method' || n.kind === 'function') && 
        ((n.metadata?.cognitive || 0) > 10 || (n.endLine - n.startLine > 25))
    );

    if (complexMethods.length > 0) {
        const penalty = Math.min(complexMethods.length * 10, 30);
        score -= penalty;
        reasons.push(`${complexMethods.length} methods are too long or complex to test easily.`);
    }

    // 4. Global State / Side Effects (Simple detection)
    const topLevelVariables = ast.root.children.filter(n => n.kind === 'variable');
    if (topLevelVariables.length > 5) {
        score -= 10;
        reasons.push('Many top-level variables detected. Risk of shared mutable state.');
    }

    const normalizedScore = Math.max(0, score);

    return {
      score: normalizedScore,
      level: this._levelFor(normalizedScore),
      reasons: reasons.slice(0, 5) // Limit to top 5 reasons
    };
  }

  private _levelFor(score: number): 'easy' | 'moderate' | 'hard' {
    if (score >= 80) return 'easy';
    if (score >= 50) return 'moderate';
    return 'hard';
  }
}
