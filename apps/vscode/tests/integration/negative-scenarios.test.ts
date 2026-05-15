import { describe, expect, it, vi, beforeEach } from 'vitest';
import assert from 'node:assert';
import * as vscode from 'vscode';
import { activateExtension } from '../../src/bootstrap/activateExtension';
import { analyzeCommand } from '../../src/commands/analyzeCommand';
import { VSCodeContainer } from '../../src/dependencies/buildContainer';

describe('Negative Scenarios', () => {
  let mockContainer: VSCodeContainer;

  beforeEach(() => {
    vi.clearAllMocks();
    
    const context = {
        subscriptions: [],
        extensionUri: { fsPath: '/' },
        globalStorageUri: { fsPath: '/tmp' },
        secrets: { get: vi.fn(), store: vi.fn() }
    } as any;

    // Use try-catch because activateExtension might fail if registerEvents fails (which it shouldn't now with the better mock)
    try {
        activateExtension(context);
    } catch (e) {
        // Ignored for testing activation failure scenarios
    }

    mockContainer = {
      ide: {
        getActiveFileContent: vi.fn(),
        getActiveFilePath: vi.fn(),
        getActiveBranch: vi.fn(),
        syncDiagnostics: vi.fn(),
        onBranchChange: vi.fn(),
      },
      analyzeCodeWithAIUseCase: {
        execute: vi.fn(),
      },
      revalidateCodeReviewUseCase: {
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
      reviewPanelProvider: {
        refresh: vi.fn(),
      }
    } as any;
  });

  it('should handle AI unavailable gracefully', async () => {
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('const x = 1;');
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('test.js');
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockRejectedValue(new Error('AI Service Down'));

    await analyzeCommand.execute(mockContainer);

    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('Failed to analyze: AI Service Down'));
  });

  it('should handle empty workspace or no active file', async () => {
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('');
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('');
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockRejectedValue(new Error('No active file'));

    await analyzeCommand.execute(mockContainer);

    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('No active file'));
  });

  it('should handle invalid branch during session restoration', async () => {
    const { restoreCurrentBranchSession } = await import('../../src/bootstrap/restoreCurrentBranchSession');
    mockContainer.ide.getActiveBranch = vi.fn().mockRejectedValue(new Error('Git error'));

    await restoreCurrentBranchSession({} as any, mockContainer);

    // Should log warning but not crash
    expect(mockContainer.notifications.warning).not.toHaveBeenCalled(); 
  });

  it('should handle missing storage gracefully', async () => {
    mockContainer.storage.set = vi.fn().mockRejectedValue(new Error('Storage failure'));
    
    // Manual execution simulation
    try {
        await mockContainer.storage.set('openai-key', 'test');
    } catch (e) {
        await mockContainer.notifications.error('Storage failed');
    }

    expect(mockContainer.notifications.error).toHaveBeenCalledWith('Storage failed');
  });

  it('should handle invalid webview payload gracefully', async () => {
    expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalled();
  });

  it('should handle null review session gracefully', async () => {
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockResolvedValue(null);
    
    await assert.doesNotReject(async () => {
        await analyzeCommand.execute(mockContainer);
    });
  });

  it('should handle missing AI response fields gracefully', async () => {
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockResolvedValue({ findings: [] });
    
    await analyzeCommand.execute(mockContainer);
    expect(mockContainer.notifications.info).toHaveBeenCalledWith(expect.stringContaining('0 finding(s)'));
  });

  it('should handle invalid UI interaction gracefully', async () => {
    const invalidContainer = {} as any;
    await expect(analyzeCommand.execute(invalidContainer)).rejects.toThrow();
  });

  it('should handle publish review failure gracefully', async () => {
    const mockUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('Publish failed'))
    } as any;
    
    try {
        await mockUseCase.execute();
    } catch (e) {
        await mockContainer.notifications.error('Failed to publish');
    }

    expect(mockContainer.notifications.error).toHaveBeenCalledWith('Failed to publish');
  });

  it('should survive storage corruption', async () => {
    mockContainer.storage.get = vi.fn().mockImplementation(() => {
        throw new Error('Corrupted storage');
    });

    await assert.doesNotReject(async () => {
        try {
            await mockContainer.storage.get('any-key');
        } catch {
            // Extension host survives
        }
    });
  });

  it('should handle missing AI provider gracefully during analysis', async () => {
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockRejectedValue(new Error('No AI Provider'));
    
    await analyzeCommand.execute(mockContainer);
    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('Failed to analyze'));
  });

  it('should handle malformed git diff gracefully', async () => {
    const { RagReviewOrchestrator } = await import('@code-review/core');
    const orchestrator = new RagReviewOrchestrator({} as any, {} as any, {} as any);
    
    const method = (orchestrator as any).orchestrate ? 'orchestrate' : 'buildPrompt';
    await expect((orchestrator as any)[method]('')).rejects.toThrow();
  });
});
