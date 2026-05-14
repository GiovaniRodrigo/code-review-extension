import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { ReviewPanelProvider } from '../../../src/providers/ReviewPanelProvider';

describe('ReviewPanelProvider', () => {
  it('should create provider', () => {
    const provider = new ReviewPanelProvider();
    expect(provider).toBeDefined();
  });

  it('should resolve webview view', () => {
    const provider = new ReviewPanelProvider();
    const mockWebviewView = {
        webview: {
            html: ''
        }
    } as any;

    provider.resolveWebviewView(mockWebviewView);

    expect(mockWebviewView.webview.html).toContain('Review Findings');
  });

  it('should clear review panel', () => {
    const provider = new ReviewPanelProvider();
    const consoleSpy = vi.spyOn(console, 'log');
    
    provider.clear('test message');

    expect(consoleSpy).toHaveBeenCalledWith('Review panel cleared: test message');
  });
});
