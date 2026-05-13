import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { VSCodeAdapter } from '../../../src/adapters/VSCodeAdapter';
import { pendingFinding } from '../../fixtures/finding.fixture';

describe('VSCodeAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (vscode.window as any).activeTextEditor = undefined;
  });

  it('retorna conteúdo e caminho do editor ativo', async () => {
    (vscode.window as any).activeTextEditor = {
      document: {
        uri: { fsPath: '/tmp/example.ts' },
        getText: vi.fn(() => 'const a = 1;')
      }
    };

    const adapter = new VSCodeAdapter();

    await expect(adapter.getActiveFileContent()).resolves.toBe('const a = 1;');
    await expect(adapter.getActiveFilePath()).resolves.toBe('/tmp/example.ts');
  });

  it('retorna branch do Git quando a extensão Git está disponível', async () => {
    vi.mocked(vscode.extensions.getExtension).mockReturnValueOnce({
      isActive: true,

      activate: vi.fn(),

      exports: {
        getAPI: () => ({
          repositories: [
            {
              state: {
                HEAD: {
                  name: 'feat/review'
                }
              }
            }
          ]
        })
      }
    } as any);

    await expect(new VSCodeAdapter().getActiveBranch()).resolves.toBe('feat/review');
  });

  it('aplica fix somente quando finding está aprovado e usuário confirma', async () => {
    const document = {
      lineAt: vi.fn(() => ({
        text: 'const oldValue = true;',
        range: 'line-range'
      }))
    };

    const editor = {
      edit: vi.fn(async (callback: any) => {
        callback({
          replace: vi.fn()
        });

        return true;
      })
    };

    vi.mocked(vscode.workspace.openTextDocument)
      .mockResolvedValueOnce(document as any);

    vi.mocked(vscode.window.showTextDocument)
      .mockResolvedValueOnce(editor as any);

    vi.mocked(vscode.window.showWarningMessage)
      .mockResolvedValueOnce('Apply Fix' as any);

    await new VSCodeAdapter().applyFix({
      ...pendingFinding,
      status: 'approved'
    });

    expect(editor.edit).toHaveBeenCalledWith(expect.any(Function));

    expect(vscode.window.showInformationMessage)
      .toHaveBeenCalledWith(
        'Suggested fix applied at /tmp/example.ts:3'
      );
  });

  it('não aplica fix quando finding ainda não foi aprovado', async () => {
    await new VSCodeAdapter().applyFix({
      ...pendingFinding,
      status: 'pending'
    });

    expect(vscode.window.showWarningMessage)
      .toHaveBeenCalledWith(
        'Approve the finding before applying its suggested fix.'
      );
  });
});