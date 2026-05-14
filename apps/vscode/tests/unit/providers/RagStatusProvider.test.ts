import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { RagStatusProvider } from '../../../src/providers/RagStatusProvider';

describe('RagStatusProvider', () => {
  it('should create provider', () => {
    const provider = new RagStatusProvider();
    expect(provider).toBeDefined();
  });

  it('should resolve webview view', () => {
    const provider = new RagStatusProvider();
    const mockWebviewView = {
        webview: {
            html: ''
        }
    } as any;

    provider.resolveWebviewView(mockWebviewView);

    expect(mockWebviewView.webview.html).toContain('RAG Status');
  });
});
