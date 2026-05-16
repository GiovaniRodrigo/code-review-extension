import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProjectChatUseCase } from '../../../../../src/application/use-cases/ai/ProjectChatUseCase';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';
import { RagContextBuilderPort } from '../../../../../src/ports/rag/RagContextBuilderPort';

describe('ProjectChatUseCase', () => {
  let mockAI: any;
  let mockContext: any;

  beforeEach(() => {
    mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [{ message: 'The project uses Clean Architecture.' }]
      })
    };

    mockContext = {
      buildContext: vi.fn().mockResolvedValue([{ source: 'a.ts', content: 'c' }])
    };
  });

  it('should get context and return an answer from AI', async () => {
    const useCase = new ProjectChatUseCase(mockAI, mockContext, {} as any, {} as any);
    const result = await useCase.execute('What architecture is used?');

    expect(result.answer).toBe('The project uses Clean Architecture.');
    expect(result.relevantFiles).toContain('a.ts');
    expect(mockContext.buildContext).toHaveBeenCalled();
  });

  it('should handle case where AI returns no findings', async () => {
      mockAI.analyzeCode.mockResolvedValue({ findings: [] });
      const useCase = new ProjectChatUseCase(mockAI, mockContext, {} as any, {} as any);
      const result = await useCase.execute('test');
      expect(result.answer).toContain("I'm sorry");
  });

  it('should handle case where RAG returns no context', async () => {
      mockContext.buildContext.mockResolvedValue([]);
      const useCase = new ProjectChatUseCase(mockAI, mockContext, {} as any, {} as any);
      const result = await useCase.execute('test');
      expect(result.relevantFiles).toHaveLength(0);
      expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
          context: expect.stringContaining('CONTEXT FROM CODEBASE:\n\n')
      }));
  });

  it('should accept history even if it is currently not used in prompt', async () => {
      const useCase = new ProjectChatUseCase(mockAI, mockContext, {} as any, {} as any);
      const history = [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello' }] as any;
      await useCase.execute('next', history);
      expect(mockAI.analyzeCode).toHaveBeenCalled();
  });
});

