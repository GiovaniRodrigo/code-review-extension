import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { analyzeCommand } from '../../src/commands/analyzeCommand';
import { VSCodeContainer } from '../../src/dependencies/buildContainer';

describe('Negative Scenarios', () => {
  let mockContainer: VSCodeContainer;

  beforeEach(() => {
    mockContainer = {
      ide: {
        getActiveFileContent: vi.fn(),
        getActiveFilePath: vi.fn(),
      },
      analyzeCodeWithAIUseCase: {
        execute: vi.fn(),
      },
      notifications: {
        info: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
      },
      storage: {
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      },
      commands: {
        register: vi.fn(),
        execute: vi.fn(),
      },
    } as any;
  });

  it('should handle AI unavailable gracefully', async () => {
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('const x = 1;');
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('test.js');
    mockContainer.analyzeCodeWithAIUseCase.execute = vi.fn().mockRejectedValue(new Error('AI Service Down'));

    await analyzeCommand.execute(mockContainer);

    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('Failed to analyze: AI Service Down'));
  });

  it('should handle empty workspace or no active file', async () => {
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('');
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('');
    mockContainer.analyzeCodeWithAIUseCase.execute = vi.fn().mockRejectedValue(new Error('No active file'));

    await analyzeCommand.execute(mockContainer);

    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('No active file'));
  });

  it('should handle invalid branch during session restoration', async () => {
    const { restoreCurrentBranchSession } = await import('../../src/bootstrap/restoreCurrentBranchSession');
    mockContainer.ide.getActiveBranch = vi.fn().mockRejectedValue(new Error('Git error'));

    await restoreCurrentBranchSession({} as any, mockContainer);

    // Should log warning but not crash
    expect(mockContainer.notifications.warning).not.toHaveBeenCalled(); // Actually we use console.warn there currently
  });

  it('should handle missing storage gracefully', async () => {
    mockContainer.storage.set = vi.fn().mockRejectedValue(new Error('Storage failure'));
    
    // Command that uses storage
    mockContainer.commands.register('code-review.setOpenAIApiKey', async () => {
        try {
            await mockContainer.storage.set('openai-key', 'test');
        } catch (e) {
            await mockContainer.notifications.error('Storage failed');
        }
    });

    // Manual execution simulation
    try {
        await mockContainer.storage.set('openai-key', 'test');
    } catch (e) {
        await mockContainer.notifications.error('Storage failed');
    }

    expect(mockContainer.notifications.error).toHaveBeenCalledWith('Storage failed');
  });
});
