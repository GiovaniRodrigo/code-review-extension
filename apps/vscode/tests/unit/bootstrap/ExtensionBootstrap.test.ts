import { describe, it, expect, vi } from 'vitest';
import { ExtensionBootstrap } from '../../../src/bootstrap/ExtensionBootstrap';
import * as vscode from 'vscode';

describe('ExtensionBootstrap', () => {
  it('should initialize extension and register provider', () => {
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
