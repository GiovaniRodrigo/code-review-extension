/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as reviewView from '../../apps/vscode/src/ui/js/reviewView.js';

describe('reviewView.js', () => {
  let vscodeMock;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    
    vscodeMock = {
      postMessage: vi.fn()
    };
    globalThis.acquireVsCodeApi = () => vscodeMock;
    reviewView.setApi(vscodeMock);
  });

  it('should render loading state', () => {
    reviewView.renderState({
      type: 'state',
      state: 'loading',
      message: 'Loading review...'
    });

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Loading review...');
    expect(app.querySelector('.spinner')).not.toBeNull();
  });

  it('should render ready state with findings', () => {
    reviewView.renderState({
      type: 'state',
      state: 'ready',
      findings: [
        { id: '1', severity: 'error', message: 'Bug found', file: 'test.js', status: 'pending' }
      ]
    });

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Bug found');
    expect(app.innerHTML).toContain('test.js');
    expect(app.querySelector('.finding-error')).not.toBeNull();
  });

  it('should send message to vscode on button click', () => {
    // We need to re-mock or ensure reviewView uses our mock
    // In our refactored reviewView, it calls acquireVsCodeApi at top level if not in module.exports context.
    // In Vitest it's a module, so it might have already tried to call it.
    
    reviewView.renderState({
      type: 'state',
      state: 'ready',
      findings: [
        { id: '1', severity: 'error', message: 'Bug', file: 'f.js', status: 'pending' }
      ]
    });

    // Manually trigger the event because we are calling functions directly
    const approveButton = document.querySelector('button[data-action="approve"]');
    approveButton.click();

    // Note: Since we are in a module context, vscode variable inside reviewView.js might be undefined
    // unless we ensure acquireVsCodeApi was available when it was imported.
    // Let's check if postMessage was called.
    expect(vscodeMock.postMessage).toHaveBeenCalledWith({
      type: 'approve',
      id: '1'
    });
  });

  it('should render error state', () => {
    reviewView.renderState({
      type: 'state',
      state: 'error',
      message: 'Something went wrong'
    });

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Something went wrong');
    expect(app.querySelector('.error-panel')).not.toBeNull();
  });

  it('should render finding with suggested fix', () => {
    const html = reviewView.renderFinding({
        id: '1',
        severity: 'warning',
        message: 'Fix this',
        file: 'test.ts',
        status: 'pending',
        suggestedFix: 'const x = 2;'
    });

    expect(html).toContain('suggested-fix');
    expect(html).toContain('const x = 2;');
    expect(html).toContain('Aplicar fix');
  });

  it('should escape HTML correctly', () => {
    const escaped = reviewView.escapeHtml('<script>alert(1)</script>');
    expect(escaped).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('should handle malformed message gracefully', () => {
    reviewView.renderState({ type: 'other' });
    const app = document.getElementById('app');
    expect(app.innerHTML).toBe('');
  });
});
