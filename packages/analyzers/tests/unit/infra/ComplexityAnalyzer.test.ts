import { describe, expect, it, vi } from 'vitest';
import { ComplexityAnalyzer } from '../../../src/infra/ComplexityAnalyzer';
import { AstBuilderPort } from '@code-review/core';
import * as fs from 'fs';

vi.mock('fs');

describe('ComplexityAnalyzer', () => {
  it('deve analisar complexidade (mock)', async () => {
    const astBuilder: AstBuilderPort = {
      build: vi.fn().mockResolvedValue({
        root: {
          kind: 'sourceFile',
          children: [
            {
              kind: 'method',
              name: 'longMethod',
              startLine: 1,
              endLine: 40,
              children: []
            }
          ]
        }
      })
    };

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('');

    const analyzer = new ComplexityAnalyzer(astBuilder);
    const findings = await analyzer.analyze(['test.ts']);
    
    expect(findings.length).toBe(1);
    expect(findings[0].rule).toBe('complexity.long-method');
  });
});
