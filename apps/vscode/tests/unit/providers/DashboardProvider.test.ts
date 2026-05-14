import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { DashboardProvider } from '../../../src/providers/DashboardProvider';

describe('DashboardProvider', () => {
  let provider: DashboardProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new DashboardProvider();
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should resolve webview and show initial metrics', () => {
    const mockWebviewView = {
        webview: {
            options: {},
            html: ''
        }
    } as any;

    provider.resolveWebviewView(mockWebviewView);

    expect(mockWebviewView.webview.html).toContain('Coverage');
    expect(mockWebviewView.webview.html).toContain('55%');
    expect(mockWebviewView.webview.html).toContain('Mutation Score');
    expect(mockWebviewView.webview.html).toContain('97%');
  });

  it('should update webview with new data', () => {
    const mockWebviewView = {
        webview: {
            options: {},
            html: ''
        }
    } as any;

    provider.resolveWebviewView(mockWebviewView);
    
    provider.update({
        coverage: 80,
        mutationScore: 90,
        gatesPassed: false,
        buildStatus: 'failed'
    });

    expect(mockWebviewView.webview.html).toContain('80%');
    expect(mockWebviewView.webview.html).toContain('90%');
    expect(mockWebviewView.webview.html).toContain('FAILED');
    expect(mockWebviewView.webview.html).toContain('failed');
  });
});
