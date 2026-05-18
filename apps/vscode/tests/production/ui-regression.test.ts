import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));

describe('UI regression gate', () => {
  it('keeps dashboard and central workspace commands contributed', () => {
    const commands = new Set(pkg.contributes.commands.map((command: any) => command.command));
    expect(commands.has('code-review.openDashboard')).toBe(true);
    expect(commands.has('code-review.openWorkspace')).toBe(true);
    expect(commands.has('code-review.runUiRegressionGate')).toBe(true);
  });

  it('keeps primary views in the Code Review activity bar', () => {
    const views = pkg.contributes.views['code-review'].map((view: any) => view.id);
    expect(views).toContain('code-review.dashboard');
    expect(views).toContain('code-review.findingsView');
    expect(views).toContain('code-review.chatView');
    expect(views).toContain('code-review.ragStatus');
    expect(views).toContain('code-review.dependencyGraph');
  });

  it('keeps new roadmap commands visible in the command palette', () => {
    const commandPalette = new Set(pkg.contributes.menus.commandPalette.map((item: any) => item.command));
    for (const command of [
      'code-review.openRagContextExplorer',
      'code-review.openReviewSessionTimeline',
      'code-review.openProCommercialCenter',
      'code-review.openTeamSyncCenter',
      'code-review.openEnterpriseReadinessReport'
    ]) {
      expect(commandPalette.has(command), command).toBe(true);
    }
  });
});
