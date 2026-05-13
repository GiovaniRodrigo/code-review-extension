import { describe, it, expect, vi } from 'vitest';
import { VSCodeAdapter } from '../src/VSCodeAdapter';
import * as vscode from 'vscode';

vi.mock('vscode', () => ({
  window: {
    activeTextEditor: {
      document: {
        getText: vi.fn().mockReturnValue('content'),
        uri: { fsPath: '/workspace/test.ts' },
      },
    },
    showTextDocument: vi.fn().mockResolvedValue({
      selection: {},
      revealRange: vi.fn(),
    }),
    showInformationMessage: vi.fn(),
    showWarningMessage: vi.fn(),
    showErrorMessage: vi.fn(),
  },
  workspace: {
    openTextDocument: vi.fn().mockResolvedValue({}),
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
});
