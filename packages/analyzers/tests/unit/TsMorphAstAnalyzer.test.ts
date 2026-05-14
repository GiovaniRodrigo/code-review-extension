import { describe, it, expect } from 'vitest';
import { TsMorphAstAnalyzer } from '../../src/infra/TsMorphAstAnalyzer';
import * as path from 'node:path';
import * as fs from 'node:fs';

describe('TsMorphAstAnalyzer', () => {
  it('should detect classes in a file', async () => {
    const analyzer = new TsMorphAstAnalyzer();
    const testFile = path.resolve(__dirname, 'TsMorphTest.ts');
    fs.writeFileSync(testFile, 'class TestClass {}');
    
    try {
      const findings = await analyzer.analyze([testFile]);
      expect(findings).toHaveLength(1);
      expect(findings[0].message).toContain('Class detected: TestClass');
      expect(findings[0].rule).toBe('ast.class-detected');
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });

  it('should handle anonymous classes', async () => {
    const analyzer = new TsMorphAstAnalyzer();
    const testFile = path.resolve(__dirname, 'TsMorphAnonTest.ts');
    fs.writeFileSync(testFile, 'export default class {}');
    
    try {
      const findings = await analyzer.analyze([testFile]);
      expect(findings).toHaveLength(1);
      expect(findings[0].message).toContain('Class detected: anonymous');
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });
});
