import { describe, expect, it } from 'vitest';
import { renderDashboardHtml } from '../src/dashboard/renderDashboardHtml';
import { renderRagStatusHtml } from '../src/rag/renderRagStatusHtml';
import { renderSetupHtml } from '../src/setup/renderSetupHtml';

describe('View Renderers', () => {
  it('renderDashboardHtml returns HTML with M3 classes', () => {
    const state: any = {
      heat: [],
      logs: [],
      coverage: 80,
      testability: { score: 'A', level: 'easy' },
      gatesPassed: true
    };
    const html = renderDashboardHtml(state);
    expect(html).toContain('cr-page');
    expect(html).toContain('cr-card');
    expect(html).toContain('Code Review Dashboard');
  });

  it('renderRagStatusHtml returns HTML with M3 classes', () => {
    const state: any = {
      status: 'indexed',
      totalChunks: 100
    };
    const html = renderRagStatusHtml(state);
    expect(html).toContain('cr-badge');
    expect(html).toContain('RAG Status');
  });

  it('renderSetupHtml returns HTML with M3 classes', () => {
    const state: any = {
      step: 'provider'
    };
    const html = renderSetupHtml(state);
    expect(html).toContain('cr-page');
    expect(html).toContain('Guided Setup');
  });
});
