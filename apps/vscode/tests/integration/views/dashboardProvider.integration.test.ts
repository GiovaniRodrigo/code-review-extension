import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { DashboardProvider } from '../../../src/providers/DashboardProvider';

describe('dashboardProvider integration', () => {
  it('should resolve webview and show real metrics', async () => {
    const provider = new DashboardProvider();
    
    const webviewView = {
      webview: {
        options: {},
        html: '',
        onDidReceiveMessage: vi.fn()
      }
    } as unknown as vscode.WebviewView;

    provider.resolveWebviewView(webviewView);

    expect(webviewView.webview.html).toContain('Coverage');
    expect(webviewView.webview.html).toContain('Testability');
    expect(webviewView.webview.html).toContain('85');
  });
});
