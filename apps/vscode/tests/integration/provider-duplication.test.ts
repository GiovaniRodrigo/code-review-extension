import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { registerViews } from '../../src/bootstrap/registerViews';

describe('Provider Duplication Regression Test', () => {
  it('should not register views multiple times when registerViews is called repeatedly', () => {
    const context = {
      subscriptions: [] as any[]
    } as vscode.ExtensionContext;
    
    const container = {
      dashboardProvider: {},
      reviewPanelProvider: {},
      chatProvider: {},
      ragStatusProvider: {},
      dependencyGraphProvider: {}
    } as any;

    const registerSpy = vi.spyOn(vscode.window, 'registerWebviewViewProvider');

    // First call
    registerViews(context, container);
    const firstCallCount = registerSpy.mock.calls.length;
    expect(firstCallCount).toBeGreaterThan(0);

    // Second call
    registerViews(context, container);
    expect(registerSpy.mock.calls.length).toBe(firstCallCount);
  });
});
