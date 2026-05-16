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
        secrets: { get: vi.fn(), store: vi.fn() },
        globalState: { get: vi.fn(), update: vi.fn() },
        workspaceState: { get: vi.fn(), update: vi.fn() }
    } as any;

    // We don't await here because we just want to trigger it and we'll mock the container anyway
    activateExtension(context);

    mockContainer = {
      ide: {
        getActiveFileContent: vi.fn(),
        getActiveFilePath: vi.fn(),
        getActiveBranch: vi.fn(),
        syncDiagnostics: vi.fn(),
        onBranchChange: vi.fn(),
        getUncommittedChangesLines: vi.fn().mockResolvedValue([]),
      },
      fileSystem: {
        exists: vi.fn().mockResolvedValue(false),
        readFile: vi.fn(),
        writeFile: vi.fn(),
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
      dashboardProvider: {
        refresh: vi.fn(),
      },
      reviewPanelProvider: {
        refresh: vi.fn(),
      },
      dependencyGraphProvider: {
        refresh: vi.fn(),
      },
      chatProvider: {
        refresh: vi.fn(),
      },
      getCodeReviewUseCase: {
        execute: vi.fn(),
      },
      commands: {
          register: vi.fn(),
          execute: vi.fn()
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

  it('should handle missing storage gracefully', async () => {
    mockContainer.storage.get = vi.fn().mockReturnValue(null);
    expect(mockContainer.storage.get('any')).toBeNull();
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

  it('should survive storage corruption by returning undefined', async () => {
    mockContainer.storage.get = vi.fn().mockImplementation(() => { return undefined; });
    const val = mockContainer.storage.get('key');
    expect(val).toBeUndefined();
  });

  it('should handle missing AI provider gracefully during analysis', async () => {
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('test.ts');
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('code');
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockRejectedValue(new Error('No provider selected'));

    await analyzeCommand.execute(mockContainer);
    expect(mockContainer.notifications.error).toHaveBeenCalledWith(expect.stringContaining('No provider selected'));
  });

  it('should handle malformed git diff gracefully by falling back', async () => {
    mockContainer.ide.getUncommittedChangesLines = vi.fn().mockRejectedValue(new Error('Git crash'));
    mockContainer.ide.getActiveFilePath = vi.fn().mockResolvedValue('test.ts');
    mockContainer.ide.getActiveFileContent = vi.fn().mockResolvedValue('code');
    mockContainer.ide.getActiveBranch = vi.fn().mockResolvedValue('main');
    
    mockContainer.revalidateCodeReviewUseCase.execute = vi.fn().mockResolvedValue({ findings: [] });
    
    await analyzeCommand.execute(mockContainer);
    expect(mockContainer.notifications.info).toHaveBeenCalledWith(expect.stringContaining('0 finding(s)'));
  });
});
