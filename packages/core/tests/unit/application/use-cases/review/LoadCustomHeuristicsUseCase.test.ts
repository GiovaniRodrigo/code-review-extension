import { describe, expect, it, vi } from 'vitest';
import { LoadCustomHeuristicsUseCase } from '../../../../../src/application/use-cases/review/LoadCustomHeuristicsUseCase';
import { IdeWorkspacePort } from '../../../../../src/ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../../../src/ports/ide/IdeFileSystemPort';
import { StaticRuleEngine } from '../../../../../src/StaticRuleEngine';

describe('LoadCustomHeuristicsUseCase', () => {
  it('should load custom rules from JSON file if it exists', async () => {
    const mockFS = {
      exists: vi.fn().mockResolvedValue(true),
      readFile: vi.fn().mockResolvedValue(JSON.stringify({
          rules: [{ id: 'custom-1', description: 'desc', severity: 'info', pattern: '.*' }]
      }))
    } as unknown as IdeFileSystemPort;

    const mockEngine = {
      addRules: vi.fn()
    } as unknown as StaticRuleEngine;

    const useCase = new LoadCustomHeuristicsUseCase({} as any, mockFS, mockEngine);
    await useCase.execute();

    expect(mockEngine.addRules).toHaveBeenCalled();
  });

  it('should do nothing if config file missing', async () => {
    const mockFS = {
      exists: vi.fn().mockResolvedValue(false)
    } as unknown as IdeFileSystemPort;

    const mockEngine = {
        addRules: vi.fn()
      } as unknown as StaticRuleEngine;

    const useCase = new LoadCustomHeuristicsUseCase({} as any, mockFS, mockEngine);
    await useCase.execute();

    expect(mockEngine.addRules).not.toHaveBeenCalled();
  });

  it('should handle invalid JSON gracefully', async () => {
    const mockFS = {
      exists: vi.fn().mockResolvedValue(true),
      readFile: vi.fn().mockResolvedValue('invalid{json')
    } as any;
    const mockEngine = { addRules: vi.fn() } as any;

    const useCase = new LoadCustomHeuristicsUseCase({} as any, mockFS, mockEngine);
    await useCase.execute();

    expect(mockEngine.addRules).not.toHaveBeenCalled();
  });

  it('should inject llm evaluator if analysis service is provided', async () => {
      const mockFS = {
        exists: vi.fn().mockResolvedValue(true),
        readFile: vi.fn().mockResolvedValue(JSON.stringify({ rules: [{ id: 'llm-1', prompt: 'check logic' }] }))
      } as any;
      const mockEngine = { addRules: vi.fn() } as any;
      const mockAI = { evaluateRule: vi.fn() } as any;

      const useCase = new LoadCustomHeuristicsUseCase({} as any, mockFS, mockEngine, mockAI);
      await useCase.execute();

      expect(mockEngine.addRules).toHaveBeenCalled();
  });
});
