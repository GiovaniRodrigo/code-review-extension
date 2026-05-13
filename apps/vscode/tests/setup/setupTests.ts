import { beforeEach, vi } from 'vitest';
import * as vscode from 'vscode';

beforeEach(() => {
  vi.clearAllMocks();

  (vscode.window as any).activeTextEditor = undefined;
  (vscode.window as any).visibleTextEditors = [];
  (vscode.workspace as any).workspaceFolders = [
    { name: 'main', uri: { fsPath: '/tmp/workspace' } }
  ];

  vi.mocked(vscode.workspace.getConfiguration).mockReturnValue({
    get: vi.fn((_key: string, defaultValue?: unknown) => defaultValue)
  } as any);

  vi.mocked(vscode.extensions.getExtension).mockReturnValue({
    activate: vi.fn(),
    isActive: true,
    exports: {
      getAPI: () => ({ repositories: [] })
    }
  } as any);
});
