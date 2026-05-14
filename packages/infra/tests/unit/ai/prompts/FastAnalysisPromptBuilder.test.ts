import { describe, it, expect } from 'vitest';
import { FastAnalysisPromptBuilder } from '../../../../src/ai/prompts/FastAnalysisPromptBuilder';

describe('FastAnalysisPromptBuilder', () => {
  it('should build analysis prompt', () => {
    const builder = new FastAnalysisPromptBuilder();
    const prompt = builder.buildAnalysisPrompt({
        filePath: 'test.ts',
        code: 'const x = 1;',
        mode: 'fast'
    });
    
    expect(prompt).toContain('File: test.ts');
    expect(prompt).toContain('const x = 1;');
  });
});
