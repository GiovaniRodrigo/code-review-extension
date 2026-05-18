import { describe, expect, it } from 'vitest';
import { renderReviewPanelHtml } from '../src/review/renderReviewPanelHtml';

describe('Review webview runtime script', () => {
  it('uses the shared VS Code API instance instead of acquiring it twice', () => {
    const html = renderReviewPanelHtml({
      sessionId: 'session-1',
      branch: 'main',
      loading: false,
      filter: 'all',
      collapsed: [],
      findings: [
        {
          id: 'finding-1',
          file: 'app/Providers/AppServiceProvider.php',
          line: 12,
          message: 'Potential issue',
          severity: 'warning',
          status: 'pending',
          confidenceScore: 0.9
        } as any
      ]
    });

    expect(html.match(/acquireVsCodeApi\(/g)).toHaveLength(1);
    expect(html).toContain('window.__codeReviewVsCodeApi');
    expect(html).toContain("command: 'approve'");
  });

  it('routes reply through the extension host instead of browser prompt', () => {
    const html = renderReviewPanelHtml({
      sessionId: 'session-1',
      branch: 'main',
      loading: false,
      filter: 'all',
      collapsed: [],
      findings: [
        {
          id: 'finding-1',
          file: 'vite.config.js',
          line: 12,
          message: "Don't break inline JS",
          severity: 'warning',
          status: 'pending'
        } as any
      ]
    });

    expect(html).toContain('data-review-action="reply"');
    expect(html).toContain("command: 'reply'");
    expect(html).not.toContain('prompt(');
    expect(html).not.toContain("copyFinding('");
  });
});
