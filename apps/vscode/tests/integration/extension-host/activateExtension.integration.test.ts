import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { activateExtension } from '../../../src/bootstrap/activateExtension';

describe('activateExtension integration', () => {
  it('should activate extension and setup container', async () => {
    const context = {
      subscriptions: [],
      extensionUri: { fsPath: '/' },
      globalStorageUri: { fsPath: '/tmp' },
      secrets: { get: vi.fn(), store: vi.fn() }
    } as unknown as vscode.ExtensionContext;

    await activateExtension(context);

    expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalled();
  });
});
