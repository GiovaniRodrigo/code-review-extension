import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { VSCodeAdapter } from '../../../src/adapters/ide/VSCodeAdapter';

describe('VSCodeAdapter Integration', () => {
  let adapter: VSCodeAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new VSCodeAdapter();
  });

  it('deve retornar o conteúdo do arquivo ativo', async () => {
    const mockContent = 'test content';
    (vscode.window.activeTextEditor as any) = {
      document: {
        getText: vi.fn().mockReturnValue(mockContent),
        uri: { fsPath: '/test/path.ts' }
      }
    };

    const content = await adapter.getActiveFileContent();
    expect(content).toBe(mockContent);
  });

  it('deve retornar o caminho do arquivo ativo', async () => {
    const mockPath = '/test/path.ts';
    (vscode.window.activeTextEditor as any) = {
      document: {
        uri: { fsPath: mockPath }
      }
    };

    const path = await adapter.getActiveFilePath();
    expect(path).toBe(mockPath);
  });

  it('deve mostrar um finding no editor', async () => {
    const mockFinding = {
      id: '1',
      file: '/test/path.ts',
      line: 10,
      column: 5,
      message: 'test message',
      severity: 'error' as const,
      status: 'pending' as const
    };

    await adapter.showFinding(mockFinding);

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Finding approved')
    );
  });

  it('deve focar em um finding no editor', async () => {
    const mockFinding = {
      id: '1',
      file: '/test/path.ts',
      line: 10,
      column: 5,
      message: 'test message',
      severity: 'error' as const,
      status: 'pending' as const
    };

    const mockDocument = {};
    const mockEditor = {
        selection: {},
        revealRange: vi.fn()
    };

    vi.mocked(vscode.workspace.openTextDocument).mockResolvedValue(mockDocument as any);
    vi.mocked(vscode.window.showTextDocument).mockResolvedValue(mockEditor as any);

    await adapter.focusFinding(mockFinding);

    expect(vscode.workspace.openTextDocument).toHaveBeenCalled();
    expect(vscode.window.showTextDocument).toHaveBeenCalled();
    expect(mockEditor.revealRange).toHaveBeenCalled();
  });

  it('should return empty string for content when no editor is active', async () => {
    (vscode.window.activeTextEditor as any) = undefined;
    (vscode.window.visibleTextEditors as any) = [];
    const content = await adapter.getActiveFileContent();
    expect(content).toBe('');
  });

  it('should return empty string for path when no editor is active', async () => {
    (vscode.window.activeTextEditor as any) = undefined;
    (vscode.window.visibleTextEditors as any) = [];
    const path = await adapter.getActiveFilePath();
    expect(path).toBe('');
  });

  it('should handle notifications correctly', async () => {
    await adapter.showNotification('info msg', 'info');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('info msg');

    await adapter.showNotification('warn msg', 'warning');
    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith('warn msg');

    await adapter.showNotification('err msg', 'error');
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('err msg');
  });

  it('should return branch from git extension', async () => {
    const mockBranch = 'feature-x';
    vi.mocked(vscode.extensions.getExtension).mockReturnValue({
      isActive: true,
      activate: vi.fn(),
      exports: {
        getAPI: () => ({
          repositories: [{
            state: { HEAD: { name: mockBranch } }
          }]
        })
      }
    } as any);

    const branch = await adapter.getActiveBranch();
    expect(branch).toBe(mockBranch);
  });

  it('should return fallback branch when git extension is missing', async () => {
    vi.mocked(vscode.extensions.getExtension).mockReturnValue(undefined);
    (vscode.workspace.workspaceFolders as any) = [{ name: 'main-folder' }];

    const branch = await adapter.getActiveBranch();
    expect(branch).toBe('main-folder');
  });

  it('should apply fix when approved and confirmed', async () => {
    const mockFinding = {
        id: '1',
        file: '/test.ts',
        line: 1,
        message: 'fix me',
        severity: 'error' as const,
        status: 'approved' as const,
        suggestedFix: 'fixed content'
    };

    const mockEdit = vi.fn().mockResolvedValue(true);
    const mockDocument = {
        lineAt: () => ({ text: 'old content', range: {} })
    };
    const mockEditor = { edit: mockEdit };

    vi.mocked(vscode.workspace.openTextDocument).mockResolvedValue(mockDocument as any);
    vi.mocked(vscode.window.showTextDocument).mockResolvedValue(mockEditor as any);
    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue('Apply Fix' as any);

    await adapter.applyFix(mockFinding);

    expect(mockEdit).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(expect.stringContaining('Suggested fix applied'));
  });

  it('should not apply fix if confirmation is rejected', async () => {
    const mockFinding = {
        id: '1',
        file: '/test.ts',
        line: 1,
        message: 'fix me',
        severity: 'error' as const,
        status: 'approved' as const,
        suggestedFix: 'fixed content'
    };

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue('Cancel' as any);

    await adapter.applyFix(mockFinding);

    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });
});
