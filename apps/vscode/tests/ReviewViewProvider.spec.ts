import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewViewProvider } from '../src/ReviewViewProvider';
import * as vscode from 'vscode';
import { ValidateFindingUseCase } from '@code-review/core';

// Mock vscode
vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn(),
  },
  Uri: {
    file: vi.fn(),
    parse: vi.fn(),
  },
}));

describe('ReviewViewProvider', () => {
  let provider: ReviewViewProvider;
  let mockExtensionUri: any;
  let mockValidateUseCase: any;
  let mockIDEAdapter: any;

  beforeEach(() => {
    mockExtensionUri = {} as any;
    mockValidateUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
    mockIDEAdapter = {
      focusFinding: vi.fn().mockResolvedValue(undefined),
    };
    provider = new ReviewViewProvider(mockExtensionUri, mockValidateUseCase, mockIDEAdapter);
  });

  it('should call ValidateFindingUseCase when receiving approve message', async () => {
    let messageHandler: any;
    const mockWebviewView: any = {
      webview: {
        options: {},
        onDidReceiveMessage: vi.fn((handler) => {
          messageHandler = handler;
        }),
        postMessage: vi.fn().mockResolvedValue(true),
        html: '',
      },
    };
    mockValidateUseCase.execute.mockResolvedValue({
      id: 's1',
      findings: [
        { id: 'f1', file: 't.ts', line: 1, severity: 'info', status: 'approved', message: 'ok' }
      ]
    });

    provider.resolveWebviewView(mockWebviewView, {} as any, {} as any);
    provider.updateFindings('s1', [
      { id: 'f1', file: 't.ts', line: 1, severity: 'info', status: 'pending', message: 'ok' }
    ]);

    await messageHandler({ type: 'approve', id: 'f1', sessionId: 's1' });

    expect(mockValidateUseCase.execute).toHaveBeenCalledWith('s1', 'f1', 'approved');
    expect(mockWebviewView.webview.postMessage).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'state',
      state: 'ready',
      sessionId: 's1'
    }));
  });

  it('should call IDEAdapter.focusFinding when receiving select message', async () => {
    let messageHandler: any;
    const mockWebviewView: any = {
      webview: {
        options: {},
        onDidReceiveMessage: vi.fn((handler) => {
          messageHandler = handler;
        }),
        postMessage: vi.fn().mockResolvedValue(true),
        html: '',
      },
    };

    provider.resolveWebviewView(mockWebviewView, {} as any, {} as any);

    const mockFinding = { id: 'f1', file: 't.ts', line: 1 } as any;
    provider.updateFindings('s1', [mockFinding]);

    await messageHandler({ type: 'select', id: 'f1' });

    expect(mockIDEAdapter.focusFinding).toHaveBeenCalledWith(mockFinding);
  });
});
