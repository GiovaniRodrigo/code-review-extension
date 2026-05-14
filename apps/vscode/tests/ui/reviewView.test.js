/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('reviewView.js', () => {
  let vscodeMock;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="app"></div>';

    // Mock VSCode API
    vscodeMock = {
      postMessage: vi.fn()
    };
    globalThis.acquireVsCodeApi = () => vscodeMock;

    // Load the script
    const scriptPath = path.resolve(
      'apps/vscode/src/ui/js/reviewView.js'
    );
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // We need to execute the script content in the current context
    // Since it's a simple JS file that assumes browser globals, we can eval it or use a script tag
    // For simplicity in Vitest, we'll wrap it in a function or just eval it.
    try {
      const fn = new Function('acquireVsCodeApi', 'document', 'window', scriptContent);
      fn(globalThis.acquireVsCodeApi, document, window);
    } catch {
      // If eval fails due to existing constants, we might need a more isolated approach
      // but let's try this first.
    }
  });

  it('should render loading state', () => {
    window.dispatchEvent(new window.MessageEvent('message', {
      data: {
        type: 'state',
        state: 'loading',
        message: 'Loading review...'
      }
    }));

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Loading review...');
    expect(app.querySelector('.spinner')).not.toBeNull();
  });

  it('should render ready state with findings', () => {
    window.dispatchEvent(new window.MessageEvent('message', {
      data: {
        type: 'state',
        state: 'ready',
        findings: [
          { id: '1', severity: 'error', message: 'Bug found', file: 'test.js', status: 'pending' }
        ]
      }
    }));

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Bug found');
    expect(app.innerHTML).toContain('test.js');
    expect(app.querySelector('.finding-error')).not.toBeNull();
  });

  it('should send message to vscode on button click', () => {
    window.dispatchEvent(new window.MessageEvent('message', {
      data: {
        type: 'state',
        state: 'ready',
        findings: [
          { id: '1', severity: 'error', message: 'Bug', file: 'f.js', status: 'pending' }
        ]
      }
    }));

    const approveButton = document.querySelector('button[data-action="approve"]');
    approveButton.click();

    expect(vscodeMock.postMessage).toHaveBeenCalledWith({
      type: 'approve',
      id: '1'
    });
  });

  it('should render error state', () => {
    window.dispatchEvent(new window.MessageEvent('message', {
      data: {
        type: 'state',
        state: 'error',
        message: 'Something went wrong'
      }
    }));

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('Something went wrong');
    expect(app.querySelector('.error-panel')).not.toBeNull();
  });
});
