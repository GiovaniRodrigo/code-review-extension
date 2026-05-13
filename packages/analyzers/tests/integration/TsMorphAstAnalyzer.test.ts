import { describe, expect, it } from 'vitest';
import { TsMorphAstAnalyzer } from '../../src/infra/TsMorphAstAnalyzer';

describe('TsMorphAstAnalyzer', () => {
  it('analisa arquivos TypeScript via AST', async () => {
    const findings = await new TsMorphAstAnalyzer().analyze([
      'packages/testing/src/domain/QualityGate.ts'
    ]);

    expect(findings.some(finding => finding.rule === 'ast.class-detected')).toBe(true);
  });
});
