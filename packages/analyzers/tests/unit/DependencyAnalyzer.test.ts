import { describe, it, expect } from 'vitest';
import { DependencyAnalyzer } from '../../src/infra/DependencyAnalyzer';

describe('DependencyAnalyzer', () => {
  it('should detect node_modules in paths', async () => {
    const analyzer = new DependencyAnalyzer();
    const findings = await analyzer.analyze(['src/index.ts', 'node_modules/lib/index.ts']);
    
    expect(findings).toHaveLength(1);
    expect(findings[0].file).toBe('node_modules/lib/index.ts');
    expect(findings[0].rule).toBe('dependency.no-node-modules-input');
    expect(findings[0].message).toBe('Analyzer input must not include node_modules.');
    expect(findings[0].severity).toBe('warning');
  });

  it('should return empty findings when no node_modules in paths', async () => {
    const analyzer = new DependencyAnalyzer();
    const findings = await analyzer.analyze(['src/index.ts']);
    
    expect(findings).toHaveLength(0);
  });
});
