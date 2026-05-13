import { describe, expect, it, vi } from 'vitest';
import { ReviewViewProvider } from '../../../src/views/ReviewViewProvider';
import { pendingFinding } from '../../fixtures/finding.fixture';

function createWebviewView() {
  let messageHandler: ((message: any) => unknown) | undefined;
  const view = {
    webview: {
      options: undefined,
      html: '',
      postMessage: vi.fn(),
      onDidReceiveMessage: vi.fn((handler: (message: any) => unknown) => {
        messageHandler = handler;
        return { dispose: vi.fn() };
      })
    }
  } as any;

  return { view, dispatch: (message: any) => messageHandler?.(message) };
}

describe('ReviewViewProvider', () => {
  it('publica estado ready quando findings são atualizados', () => {
    const validateUseCase = { execute: vi.fn() };
    const ideAdapter = { focusFinding: vi.fn(), applyFix: vi.fn() };
    const provider = new ReviewViewProvider({} as any, validateUseCase as any, ideAdapter as any);
    const { view } = createWebviewView();

    provider.resolveWebviewView(view, {} as any, {} as any);
    provider.updateFindings('session-1', [pendingFinding]);

    expect(view.webview.postMessage).toHaveBeenLastCalledWith({
      type: 'state',
      state: 'ready',
      message: 'Review session loaded.',
      sessionId: 'session-1',
      findings: [pendingFinding]
    });
  });

  it('foca finding quando recebe mensagem select', async () => {
    const validateUseCase = { execute: vi.fn() };
    const ideAdapter = { focusFinding: vi.fn(), applyFix: vi.fn() };
    const provider = new ReviewViewProvider({} as any, validateUseCase as any, ideAdapter as any);
    const { view, dispatch } = createWebviewView();

    provider.resolveWebviewView(view, {} as any, {} as any);
    provider.updateFindings('session-1', [pendingFinding]);
    await dispatch({ type: 'select', id: 'finding-1' });

    expect(ideAdapter.focusFinding).toHaveBeenCalledWith(pendingFinding);
  });

  it('valida finding quando recebe approve', async () => {
    const validateUseCase = {
      execute: vi.fn(async () => ({ id: 'session-1', findings: [{ ...pendingFinding, status: 'approved' }] }))
    };
    const ideAdapter = { focusFinding: vi.fn(), applyFix: vi.fn() };
    const provider = new ReviewViewProvider({} as any, validateUseCase as any, ideAdapter as any);
    const { view, dispatch } = createWebviewView();

    provider.resolveWebviewView(view, {} as any, {} as any);
    provider.updateFindings('session-1', [pendingFinding]);
    await dispatch({ type: 'approve', id: 'finding-1' });

    expect(validateUseCase.execute).toHaveBeenCalledWith('session-1', 'finding-1', 'approved');
  });

  it('aplica fix quando recebe applyFix para finding existente', async () => {
    const validateUseCase = { execute: vi.fn() };
    const ideAdapter = { focusFinding: vi.fn(), applyFix: vi.fn() };
    const provider = new ReviewViewProvider({} as any, validateUseCase as any, ideAdapter as any);
    const { view, dispatch } = createWebviewView();

    provider.resolveWebviewView(view, {} as any, {} as any);
    provider.updateFindings('session-1', [pendingFinding]);
    await dispatch({ type: 'applyFix', id: 'finding-1' });

    expect(ideAdapter.applyFix).toHaveBeenCalledWith(pendingFinding);
  });
});
