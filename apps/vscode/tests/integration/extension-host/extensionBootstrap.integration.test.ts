import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { ExtensionBootstrap } from '../../../src/bootstrap/ExtensionBootstrap';

describe('extensionBootstrap integration', () => {
  it('should initialize extension and register providers', async () => {
    const context = {
      subscriptions: [],
      extensionUri: { fsPath: '/' },
      secrets: { get: vi.fn(), store: vi.fn() }
    } as unknown as vscode.ExtensionContext;

    const bootstrap = new ExtensionBootstrap(context);
    bootstrap.initialize();

    expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalled();
  });
});
