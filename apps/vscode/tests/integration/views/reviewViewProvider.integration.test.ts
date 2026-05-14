import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { ReviewViewProvider } from '../../../src/views/ReviewViewProvider';

vi.mock('../../../src/views/getWebviewContent', () => ({
  getWebviewContent: vi.fn(() => '<html></html>')
}));

describe('reviewViewProvider integration', () => {
  it('should resolve webview and handle messages', async () => {
    const extensionUri = { fsPath: '/' } as vscode.Uri;
    const validateUseCase = { execute: vi.fn() };
    const ideAdapter = { focusFinding: vi.fn(), applyFix: vi.fn() };
    
    const provider = new ReviewViewProvider(extensionUri, validateUseCase as any, ideAdapter as any);
    
    const webviewView = {
      webview: {
        options: {},
        onDidReceiveMessage: vi.fn(),
        postMessage: vi.fn(),
        asWebviewUri: vi.fn().mockReturnValue({ toString: () => 'uri' }),
        cspSource: 'csp'
      }
    } as unknown as vscode.WebviewView;

    provider.resolveWebviewView(webviewView, {} as any, {} as any);

    expect(webviewView.webview.onDidReceiveMessage).toHaveBeenCalled();
    expect(webviewView.webview.postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'state'
    }));
  });
});
