import { describe, it, expect, vi } from 'vitest';
import { VSCodeAdapter } from '../src/VSCodeAdapter';
import * as vscode from 'vscode';

const { mockReplace, mockEdit, mockLine } = vi.hoisted(() => {
  const replace = vi.fn();
  return {
    mockReplace: replace,
    mockEdit: vi.fn(async (callback) => {
      callback({ replace });
      return true;
    }),
    mockLine: {
      text: 'let x = 1;',
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } }
    }
  };
});

vi.mock('vscode', () => ({
  window: {
    activeTextEditor: {
      document: {
        getText: vi.fn().mockReturnValue('content'),
        uri: { fsPath: '/workspace/test.ts' },
      },
    },
    visibleTextEditors: [
      {
        document: {
          getText: vi.fn().mockReturnValue('visible content'),
          uri: { fsPath: '/workspace/visible.ts' },
        },
      },
    ],
    showTextDocument: vi.fn().mockResolvedValue({
      selection: {},
      revealRange: vi.fn(),
      edit: mockEdit,
    }),
    showInformationMessage: vi.fn(),
    showWarningMessage: vi.fn().mockResolvedValue('Apply Fix'),
    showErrorMessage: vi.fn(),
  },
  workspace: {
    openTextDocument: vi.fn().mockResolvedValue({
      lineAt: vi.fn().mockReturnValue(mockLine),
    }),
    workspaceFolders: [{ name: 'workspace-fallback' }],
  },
  extensions: {
    getExtension: vi.fn().mockReturnValue({
      exports: {
        getAPI: vi.fn().mockReturnValue({
          repositories: [
            {
              state: {
                HEAD: {
                  name: 'feat/mvp'
                }
              }
            }
          ]
        })
      }
    }),
  },
  languages: {
    createDiagnosticCollection: vi.fn().mockReturnValue({
      set: vi.fn(),
    }),
  },
  Diagnostic: vi.fn().mockImplementation(function(range, message, severity) {
    return { range, message, severity, source: undefined, code: undefined };
  }),
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2,
  },
  Range: vi.fn().mockImplementation(function(l1, c1, l2, c2) {
    return { start: { line: l1, character: c1 }, end: { line: l2, character: c2 } };
  }),
  Selection: vi.fn().mockImplementation(function(s, e) {
    return { start: s, end: e };
  }),
  TextEditorRevealType: { InCenter: 1 },
  Uri: {
    file: vi.fn().mockReturnValue({}),
  },
}));

describe('VSCodeAdapter', () => {
  it('should get active file content', async () => {
    const adapter = new VSCodeAdapter();
    const content = await adapter.getActiveFileContent();
    expect(content).toBe('content');
  });

  it('should get active file path', async () => {
    const adapter = new VSCodeAdapter();
    const filePath = await adapter.getActiveFilePath();
    expect(filePath).toBe('/workspace/test.ts');
  });

  it('should fall back to visible editor when there is no active file editor', async () => {
    const originalActiveEditor = (vscode.window as any).activeTextEditor;
    (vscode.window as any).activeTextEditor = undefined;

    const adapter = new VSCodeAdapter();

    await expect(adapter.getActiveFileContent()).resolves.toBe('visible content');
    await expect(adapter.getActiveFilePath()).resolves.toBe('/workspace/visible.ts');

    (vscode.window as any).activeTextEditor = originalActiveEditor;
  });

  it('should get active branch from VS Code Git API', async () => {
    const adapter = new VSCodeAdapter();
    const branch = await adapter.getActiveBranch();
    expect(branch).toBe('feat/mvp');
  });

  it('should publish approved finding as diagnostic', async () => {
    const adapter = new VSCodeAdapter();
    const mockFinding = {
      id: 'finding-1',
      file: 'test.ts',
      line: 10,
      message: 'Test',
      severity: 'warning',
      status: 'approved'
    } as any;

    await adapter.showFinding(mockFinding);

    const collection = (vscode.languages.createDiagnosticCollection as any).mock.results[0].value;
    expect(collection.set).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Finding approved: Test at line 10'
    );
  });

  it('should focus finding', async () => {
    const adapter = new VSCodeAdapter();
    const mockFinding = { file: 'test.ts', line: 10, message: 'Test' } as any;
    
    await adapter.focusFinding(mockFinding);

    expect(vscode.workspace.openTextDocument).toHaveBeenCalled();
    expect(vscode.window.showTextDocument).toHaveBeenCalled();
  });

  it('should apply a suggested fix only after confirmation', async () => {
    const adapter = new VSCodeAdapter();
    const mockFinding = {
      id: 'finding-1',
      file: 'test.ts',
      line: 1,
      message: 'Use const',
      severity: 'info',
      status: 'approved',
      suggestedFix: 'const x = 1;'
    } as any;

    await adapter.applyFix(mockFinding);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining('Suggested:'),
      { modal: true },
      'Apply Fix'
    );
    expect(mockReplace).toHaveBeenCalledWith(mockLine.range, 'const x = 1;');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Suggested fix applied at test.ts:1'
    );
  });

  it('should not apply suggested fix before approval', async () => {
    const adapter = new VSCodeAdapter();
    const mockFinding = {
      id: 'finding-1',
      file: 'test.ts',
      line: 1,
      message: 'Use const',
      severity: 'info',
      status: 'pending',
      suggestedFix: 'const x = 1;'
    } as any;

    await adapter.applyFix(mockFinding);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Approve the finding before applying its suggested fix.'
    );
  });
});
