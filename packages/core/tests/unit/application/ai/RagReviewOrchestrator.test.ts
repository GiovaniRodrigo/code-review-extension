import { describe, it, expect, vi } from 'vitest';
import { RagReviewOrchestrator } from '../../../../src/application/ai/RagReviewOrchestrator';

describe('RagReviewOrchestrator', () => {
  it('should build prompt using search, context and prompt builders', async () => {
    const mockSearch = { search: vi.fn().mockResolvedValue(['chunk1']) };
    const mockContext = { build: vi.fn().mockReturnValue('context') };
    const mockPrompt = { build: vi.fn().mockReturnValue('prompt') };
    
    const orchestrator = new RagReviewOrchestrator(mockSearch as any, mockContext as any, mockPrompt as any);
    const result = await orchestrator.buildPrompt('diff');
    
    expect(result).toBe('prompt');
    expect(mockSearch.search).toHaveBeenCalledWith('diff');
    expect(mockContext.build).toHaveBeenCalledWith(['chunk1']);
    expect(mockPrompt.build).toHaveBeenCalledWith('diff', 'context');
  });
});
