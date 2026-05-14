import { describe, it, expect } from 'vitest';
import { RagContextBuilder } from '../../../../src/application/ai/RagContextBuilder';
import { RagPromptBuilder } from '../../../../src/application/ai/RagPromptBuilder';

describe('RAG Builders', () => {
  it('RagContextBuilder should build context from chunks', () => {
    const builder = new RagContextBuilder();
    const chunks = [
        { 
            content: 'const x = 1;', 
            metadata: { file: 'test.ts', startLine: 1, endLine: 1 } 
        }
    ];
    const context = builder.build(chunks as any);
    expect(context).toContain('FILE: test.ts');
    expect(context).toContain('const x = 1;');
  });

  it('RagPromptBuilder should build prompt', () => {
    const builder = new RagPromptBuilder();
    const prompt = builder.build('diff content', 'some context');
    expect(prompt).toContain('CONTEXTO:');
    expect(prompt).toContain('some context');
    expect(prompt).toContain('DIFF:');
    expect(prompt).toContain('diff content');
  });
});
