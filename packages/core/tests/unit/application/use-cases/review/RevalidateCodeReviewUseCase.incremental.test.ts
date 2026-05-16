import { describe, expect, it, vi } from 'vitest';
import { RevalidateCodeReviewUseCase } from '../../../../../src/application/use-cases/review/RevalidateCodeReviewUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';

describe('RevalidateCodeReviewUseCase', () => {
  it('should run incremental revalidation with target lines', async () => {
    const mockAI = {
      analyze: vi.fn().mockResolvedValue({ findings: [] })
    } as unknown as AIAnalysisService;

    const mockReviewService = {
      getByBranch: vi.fn().mockResolvedValue({ id: 's1', findings: [] }),
      update: vi.fn().mockResolvedValue(undefined)
    } as unknown as CodeReviewService;

    const code = Array.from({ length: 400 }, (_, i) => `function f${i}() { return ${i}; }`).join('\n');
    const mockAst = {
      build: vi.fn().mockResolvedValue({
        filePath: 'large.ts',
        language: 'typescript',
        code,
        root: {
          kind: 'sourceFile',
          name: 'large.ts',
          startLine: 1,
          endLine: 400,
          children: [
            {
              kind: 'function',
              name: 'f9',
              startLine: 10,
              endLine: 10,
              children: []
            }
          ]
        },
        metrics: {
          imports: 0,
          exports: 0,
          classes: 0,
          interfaces: 0,
          functions: 1,
          methods: 0,
          properties: 0,
          variables: 0,
          maxDepth: 1
        }
      })
    };

    const useCase = new RevalidateCodeReviewUseCase(mockAI, mockReviewService, undefined, mockAst);
    await useCase.execute({
      branch: 'main',
      code,
      filePath: 'large.ts',
      targetLines: [10]
    });

    expect(mockAI.analyze).toHaveBeenCalledWith(expect.objectContaining({
      code: expect.stringContaining('PRUNED CONTEXT')
    }));
  });
});
