import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { VSCodeAdapter } from '../../../src/adapters/VSCodeAdapter';

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
});
